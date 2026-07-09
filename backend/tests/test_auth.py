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
    
    # ---------- registration validation ----------

def _valid_payload(**overrides):
    """Base valid registration; tweak one field per test."""
    payload = {
        "email": "new@merkato.com",
        "password": "Password1!",
        "first_name": "Mohamed",
        "last_name": "Mussa",
        "zip_code": "17603",
    }
    payload.update(overrides)
    return payload


def test_register_valid_payload_succeeds(client):
    res = client.post("/api/auth/register", json=_valid_payload())
    assert res.status_code == 201


def test_register_rejects_numbers_in_first_name(client):
    res = client.post("/api/auth/register", json=_valid_payload(first_name="Mo123"))
    assert res.status_code == 400


def test_register_rejects_numbers_in_last_name(client):
    res = client.post("/api/auth/register", json=_valid_payload(last_name="99"))
    assert res.status_code == 400


def test_register_allows_hyphens_and_apostrophes_in_names(client):
    res = client.post("/api/auth/register", json=_valid_payload(
        first_name="Abdul-Rahman", last_name="O'Brien"
    ))
    assert res.status_code == 201


def test_register_rejects_password_without_uppercase(client):
    res = client.post("/api/auth/register", json=_valid_payload(password="password1!"))
    assert res.status_code == 400


def test_register_rejects_password_without_number(client):
    res = client.post("/api/auth/register", json=_valid_payload(password="Password!!"))
    assert res.status_code == 400


def test_register_rejects_password_without_symbol(client):
    res = client.post("/api/auth/register", json=_valid_payload(password="Password11"))
    assert res.status_code == 400


def test_register_rejects_short_password(client):
    res = client.post("/api/auth/register", json=_valid_payload(password="Pa1!"))
    assert res.status_code == 400


def test_register_rejects_letters_in_zip(client):
    res = client.post("/api/auth/register", json=_valid_payload(zip_code="176ab"))
    assert res.status_code == 400


def test_register_rejects_wrong_length_zip(client):
    res = client.post("/api/auth/register", json=_valid_payload(zip_code="1760"))
    assert res.status_code == 400
    
    
# ---------- email verification ----------

def test_register_does_not_return_token(client):
    res = client.post("/api/auth/register", json=_valid_payload())
    assert res.status_code == 201
    assert "token" not in res.get_json()


def test_unverified_user_cannot_login(client, unverified_user):
    res = client.post("/api/auth/login", json={
        "email": unverified_user["email"],
        "password": unverified_user["password"],
    })
    assert res.status_code == 403


def test_verify_with_correct_code_returns_token(client, unverified_user):
    res = client.post("/api/auth/verify-email", json={
        "email": unverified_user["email"],
        "code": unverified_user["code"],
    })
    assert res.status_code == 200
    data = res.get_json()
    assert "token" in data
    assert data["user"]["email_verified"] is True


def test_verify_with_wrong_code_fails(client, unverified_user):
    res = client.post("/api/auth/verify-email", json={
        "email": unverified_user["email"],
        "code": "000000",
    })
    assert res.status_code == 400
    assert "token" not in res.get_json()


def test_verified_user_can_login(client, registered_user):
    res = client.post("/api/auth/login", json={
        "email": registered_user["email"],
        "password": registered_user["password"],
    })
    assert res.status_code == 200
    assert "token" in res.get_json()


def test_five_wrong_attempts_locks_code(client, unverified_user):
    for _ in range(5):
        client.post("/api/auth/verify-email", json={
            "email": unverified_user["email"],
            "code": "000000",
        })
    # 6th attempt: even the CORRECT code must now be rejected
    res = client.post("/api/auth/verify-email", json={
        "email": unverified_user["email"],
        "code": unverified_user["code"],
    })
    assert res.status_code == 429


def test_cannot_verify_twice(client, registered_user):
    res = client.post("/api/auth/verify-email", json={
        "email": registered_user["email"],
        "code": registered_user["code"],
    })
    assert res.status_code == 400


def test_resend_gives_same_response_for_unknown_email(client):
    res = client.post("/api/auth/resend-code", json={"email": "ghost@nowhere.com"})
    assert res.status_code == 200


def test_resend_issues_fresh_working_code(client, unverified_user, capsys):
    client.post("/api/auth/resend-code", json={"email": unverified_user["email"]})
    new_code = None
    out = capsys.readouterr().out
    for line in out.splitlines():
        if "VERIFICATION CODE" in line:
            new_code = line.strip().split(":")[-1].strip()
    assert new_code is not None

    res = client.post("/api/auth/verify-email", json={
        "email": unverified_user["email"],
        "code": new_code,
    })
    assert res.status_code == 200