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

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    first_name = (data.get("first_name") or "").strip()
    last_name = (data.get("last_name") or "").strip()
    zip_code = (data.get("zip_code") or "").strip()
    phone = (data.get("phone") or "").strip()

    # Required fields
    if not email or not password or not first_name or not last_name or not zip_code:
        return jsonify({"error": "email, password, first name, last name and zip code are required"}), 400
    if len(password) < 8:
        return jsonify({"error": "password must be at least 8 characters"}), 400
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

    token = create_access_token(
        identity=user.id,
        additional_claims={"role": user.role}
    )
    return jsonify({"token": token, "user": user.to_dict()}), 201