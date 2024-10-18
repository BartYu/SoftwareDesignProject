import pytest

def register_user(client, email, password, role):
    return client.post('/auth/register', json={"email": email, "password": password, "role": role})

def login_user(client, email, password):
    return client.post("/auth/login", json={"email": email, "password": password})

@pytest.mark.parametrize(
    "email, password, role, expected_status, expected_response",
    [
        (None, "test", "volunteer", 400, {"error": "Email, password, and role are required."}),
        ("new@example.com", None, "volunteer", 400, {"error": "Email, password, and role are required."}),
        ("new@example.com", "test", None, 400, {"error": "Email, password, and role are required."}),
        (None, None, None, 400, {"error": "Email, password, and role are required."}),
        ("new@example.com", None, None, 400, {"error": "Email, password, and role are required."}),
        (None, None, "volunteer", 400, {"error": "Email, password, and role are required."}),
        ("invalid-email", "test", "volunteer", 400, {"error": "Invalid email format."}),
        ("new@example.com", "test", "invalidrole", 400, {"error": "Invalid role."}),
        ("new@example.com", "test", "admin", 201, {"msg": "User registered successfully."}),
        ("new2@example.com", "test", "volunteer", 201, {"msg": "User registered successfully."}),
        ("new@example.com", "test", "admin", 400, {"msg": "This email is already registered."}),
        ("new2@example.com", "test", "admin", 400, {"msg": "This email is already registered."}),
    ],
)
def test_register(client, email, password, role, expected_status, expected_response):
    response = client.post('/auth/register', json={"email": email, "password": password, "role": role})
    assert response.status_code == expected_status
    assert response.json == expected_response

@pytest.mark.parametrize(
    "email, password, expected_status, expected_response",
    [
        ("test@example.com", "test", 200, {"msg": "Login successful!", "role": "admin"}),
        ("invalid@example.com", "test", 401, {"error": "Invalid credentials."}),
        ("test@example.com", "invalid", 401, {"error": "Invalid credentials."}),
        (None, "test", 400, {"error": "Email and password are required."}),
        ("test@example.com", None, 400, {"error": "Email and password are required."}),
        (None, None, 400, {"error": "Email and password are required."}),
        ("invalid-email-format", "test", 400, {"error": "Invalid email format."}),
    ],
)
def test_login(client, user_data, email, password, expected_status, expected_response):
    register_user(client, user_data["email"], user_data["password"], user_data["role"])

    response = login_user(client, email, password)
    assert response.status_code == expected_status
    assert response.json == expected_response

    if expected_status == 200:
        with client:
            with client.session_transaction() as sess:
                assert sess['user_id'] == user_data["email"]

def test_logout(client, user_data):
    register_user(client, user_data["email"], user_data["password"], user_data["role"])
    login_user(client, user_data["email"], user_data["password"])

    response = client.post("/auth/logout")
    assert response.status_code == 200
    assert response.json == {"msg": "Logged out successfully!"}

    with client.session_transaction() as sess:
        assert "user_id" not in sess
