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
    with client.session_transaction() as sess:
        assert sess['user_id'] == user_data['email']
    return user_data

# Authorizing client for further testings
@pytest.fixture
def auth_client(client, login_user):
    with client.session_transaction() as sess:
        sess['user_id'] = login_user['email']
    return client

@pytest.fixture
def valid_profile():
    return  {
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
def invalid_profile():
    return {
        "name": "Tuan Hoang",
        "address1": "123 Main St",
        "address2": "Apt 4",
        "city": "Test City",
        "state": "TX",
        "zipcode": "1234", # Invalid zip
        "skills": [], # Empty
        "preferences": "None",
        "dates": [], # Empty
    }
