import pytest
from App import create_app

# Fixtures to help with unit tests
@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def user_data():
    return {"email": "test@example.com", "password": "test", "role": "admin"}

@pytest.fixture
def login_user(client, user_data):
    with client.session_transaction() as sess:
        sess['user_id'] = user_data['email']
        sess['role'] = user_data['role']
    return user_data

# Authorizing client for further testing
@pytest.fixture
def auth_client(client, login_user):
    with client.session_transaction() as sess:
        sess['user_id'] = login_user['email']
    return client

@pytest.fixture
def valid_profile():
    return {
        "name": "Tuan Hoang",
        "address1": "123 Main St",
        "address2": "Apt 4",
        "city": "Test City",
        "state": "TX",
        "zipcode": "12345",
        "skills": ["skill1", "skill2"],
        "preferences": "None",
        "dates": ["10/10/2024", "11/11/2024"]
    }

@pytest.fixture
def reset_profile(auth_client):
    # Clear the user's profile data before each test
    auth_client.delete("/user/profile")  # Adjust this based on your app's delete profile endpoint
    yield  # Allow the test to run

def test_get_empty_profile(auth_client, reset_profile):
    response = auth_client.get("/user/profile")
    assert response.status_code == 404

def test_update_valid_profile(auth_client, valid_profile, reset_profile):
    response = auth_client.put("/user/profile", json=valid_profile)
    assert response.status_code == 200
    assert response.json == {"msg": "Profile saved successfully!"}

    response = auth_client.get("/user/profile")
    assert response.status_code == 200
    fields_to_check = ['name', 'address1', 'address2', 'city', 'state', 'zipcode', 'skills', 'preferences']
    for field in fields_to_check:
        assert response.json[field] == valid_profile[field], f"{field.capitalize()} does not match!"
    converted_dates = [convert_date(date) for date in response.json['dates']]
    assert converted_dates == valid_profile['dates'], "Dates do not match!"

def test_update_invalid_profile(auth_client):
    invalid_profile = {
        "name": "Tuan Hoang",
        "address1": "123 Main St",
        "address2": "Apt 4",
        "city": "Test City",
        "state": "TX",
        "zipcode": "1234",  # Invalid zip
        "skills": [],  # Empty
        "preferences": "None",
        "dates": [],  # Empty
    }
    response = auth_client.put("/user/profile", json=invalid_profile)
    assert response.status_code == 400
    assert "errors" in response.json

@pytest.mark.parametrize("updated_profile", [
    {
        "name": "Barton",
        "address1": "234 Main St",
        "address2": "Apt 2",
        "city": "Another City",
        "state": "CA",
        "zipcode": "67890",
        "skills": ["skill2", "skill3"],
        "preferences": "Some preferences",
        "dates": ["10/11/2024", "11/10/2024"]
    }
])
def test_get_updated_profile(auth_client, updated_profile, reset_profile):
    auth_client.put("/user/profile", json=updated_profile)

    response = auth_client.get("/user/profile")
    assert response.status_code == 200
    fields_to_check = ['name', 'address1', 'address2', 'city', 'state', 'zipcode', 'skills', 'preferences']
    for field in fields_to_check:
        assert response.json[field] == updated_profile[field], f"{field.capitalize()} does not match!"

    converted_dates = [convert_date(date) for date in response.json['dates']]
    assert converted_dates == updated_profile['dates'], "Dates do not match!"
