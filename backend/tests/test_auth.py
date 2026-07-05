def test_login_success(client, registered_user):
    res = client.post("/api/auth/login", json={
        "email": registered_user["email"],
        "password": registered_user["password"],
    })
    assert res.status_code == 200
    data = res.get_json()
    assert "token" in data
    assert data["user"]["email"] == "mo@merkato.com"
    assert data["user"]["full_name"] == "Mohamed Mussa"


def test_login_wrong_password(client, registered_user):
    res = client.post("/api/auth/login", json={
        "email": registered_user["email"],
        "password": "wrongpassword",
    })
    assert res.status_code == 401
    assert "token" not in res.get_json()


def test_login_nonexistent_email(client):
    res = client.post("/api/auth/login", json={
        "email": "ghost@merkato.com",
        "password": "password123",
    })
    assert res.status_code == 401


def test_login_missing_fields(client):
    res = client.post("/api/auth/login", json={})
    assert res.status_code == 401


def test_login_email_case_insensitive(client, registered_user):
    res = client.post("/api/auth/login", json={
        "email": "MO@MERKATO.COM",
        "password": registered_user["password"],
    })
    assert res.status_code == 200


def test_login_token_works_on_protected_route(client, registered_user):
    login = client.post("/api/auth/login", json={
        "email": registered_user["email"],
        "password": registered_user["password"],
    })
    token = login.get_json()["token"]

    res = client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert res.status_code == 200
    assert res.get_json()["user"]["email"] == "mo@merkato.com"


def test_me_rejected_without_token(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401