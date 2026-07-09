import pytest
from app import create_app
from app.config import Config
from app.extensions import db


class TestConfig(Config):
    TESTING = True
    # In-memory database: fresh, fast, and vanishes after each test
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"


@pytest.fixture()
def app():
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


def _extract_code(capsys):
    """Pull the 6-digit code out of the dev-mode console output."""
    out = capsys.readouterr().out
    for line in out.splitlines():
        if "VERIFICATION CODE" in line:
            return line.strip().split(":")[-1].strip()
    return None


@pytest.fixture()
def unverified_user(client, capsys):
    """Registered but not yet verified; includes the real code."""
    payload = {
        "email": "mo@merkato.com",
        "password": "Password123@",
        "first_name": "Mohamed",
        "last_name": "Mussa",
        "zip_code": "17603",
    }
    client.post("/api/auth/register", json=payload)
    payload["code"] = _extract_code(capsys)
    return payload


@pytest.fixture()
def registered_user(client, unverified_user):
    """Fully verified user, ready for login tests."""
    client.post("/api/auth/verify-email", json={
        "email": unverified_user["email"],
        "code": unverified_user["code"],
    })
    return unverified_user

