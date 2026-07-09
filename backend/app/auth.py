import re
import random
from datetime import datetime, timedelta, timezone
from .models import User, VerificationCode
from .extensions import db, bcrypt
from .emailer import send_verification_email


from functools import wraps
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)
from .extensions import db
from .models import User



NAME_RE = re.compile(r"^[A-Za-z][A-Za-z\s'\-]*$")
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def issue_verification_code(user):
    """Create, store (hashed), and send a 6-digit code."""
    code = f"{random.randint(0, 999999):06d}"
    vc = VerificationCode(
        user_id=user.id,
        code_hash=bcrypt.generate_password_hash(code).decode("utf-8"),
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
    )
    db.session.add(vc)
    db.session.commit()
    send_verification_email(user.email, code)

@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    first_name = (data.get("first_name") or "").strip()
    last_name = (data.get("last_name") or "").strip()
    zip_code = (data.get("zip_code") or "").strip()
    phone = (data.get("phone") or "").strip()

    if not email or not password or not first_name or not last_name or not zip_code:
        return jsonify({"error": "email, password, first name, last name and zip code are required"}), 400
    if not NAME_RE.match(first_name) or not NAME_RE.match(last_name):
        return jsonify({"error": "names can only contain letters, spaces, hyphens and apostrophes"}), 400
    if len(password) < 8:
        return jsonify({"error": "password must be at least 8 characters"}), 400
    if not re.search(r"[A-Z]", password):
        return jsonify({"error": "password must include an uppercase letter"}), 400
    if not re.search(r"\d", password):
        return jsonify({"error": "password must include a number"}), 400
    if not re.search(r"[^A-Za-z0-9]", password):
        return jsonify({"error": "password must include a symbol"}), 400
    if not (zip_code.isdigit() and len(zip_code) == 5):
        return jsonify({"error": "zip code must be 5 digits"}), 400
    if phone:
        digits = "".join(c for c in phone if c.isdigit())
        if len(digits) != 10:
            return jsonify({"error": "phone number must be 10 digits"}), 400
        phone = digits
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "email already registered"}), 409

    user = User(
        email=email,
        first_name=first_name,
        last_name=last_name,
        zip_code=zip_code,
        phone=phone,
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    issue_verification_code(user)
    return jsonify({
        "message": "verification code sent",
        "email": user.email,
    }), 201
    


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "invalid email or password"}), 401
     
     
    if not user.email_verified:
        return jsonify({"error": "email not verified", "email": user.email}), 403
    token = create_access_token(
        identity=user.id,
        additional_claims={"role": user.role}
    )
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user = db.session.get(User, get_jwt_identity())
    if not user:
        return jsonify({"error": "user not found"}), 404
    return jsonify({"user": user.to_dict()}), 200


@auth_bp.post("/verify-email")
def verify_email():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    code = (data.get("code") or "").strip()

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "invalid email or code"}), 400
    if user.email_verified:
        return jsonify({"error": "email already verified"}), 400

    vc = (
        VerificationCode.query
        .filter_by(user_id=user.id, used=False)
        .order_by(VerificationCode.expires_at.desc())
        .first()
    )
    now = datetime.now(timezone.utc)
    if not vc or vc.expires_at.replace(tzinfo=timezone.utc) < now:
        return jsonify({"error": "code expired, request a new one"}), 400
    if vc.attempts >= 5:
        return jsonify({"error": "too many attempts, request a new code"}), 429

    if not bcrypt.check_password_hash(vc.code_hash, code):
        vc.attempts += 1
        db.session.commit()
        return jsonify({"error": "invalid code"}), 400

    vc.used = True
    user.email_verified = True
    db.session.commit()

    token = create_access_token(identity=user.id, additional_claims={"role": user.role})
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.post("/resend-code")
def resend_code():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()

    user = User.query.filter_by(email=email).first()
    if user and not user.email_verified:
        issue_verification_code(user)

    # Always same response — don't reveal which emails exist
    return jsonify({"message": "if that account exists, a code was sent"}), 200