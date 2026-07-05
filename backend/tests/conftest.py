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


@pytest.fixture()
def registered_user(client):
    """A user that already exists, for login tests."""
    payload = {
        "email": "mo@merkato.com",
        "password": "Password123@",
        "first_name": "Mohamed",
        "last_name": "Mussa",
        "zip_code": "17603",
    }
    client.post("/api/auth/register", json=payload)
    return payload


