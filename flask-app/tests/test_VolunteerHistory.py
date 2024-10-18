import pytest
from app import create_app  # Adjust the import based on your file structure
from routes import volunteer_history  # Assuming your route is in this module

# Fixture to create the Flask app for testing
@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    return app

# Fixture for the test client
@pytest.fixture
def client(app):
    return app.test_client()

# Fixture for valid volunteer event data
@pytest.fixture
def valid_event():
    return {
        "eventName": "Community Cleanup",
        "eventDescription": "Cleaning up the local park.",
        "location": "Central Park",
        "requiredSkills": "Teamwork, Communication",
        "urgency": "High",
        "eventDate": "2024-09-20",
        "participationStatus": "Completed",
    }

# Fixture for missing field event data
@pytest.fixture
def event_missing_field():
    return {
        "eventDescription": "Missing event name.",
        "location": "Community Center",
        "requiredSkills": "Organization",
        "urgency": "Medium",
        "eventDate": "2024-11-01",
        "participationStatus": "Pending",
    }

# Test for getting volunteer history
def test_get_volunteer_history(client):
    response = client.get('/volunteer-history')
    assert response.status_code == 200
    assert isinstance(response.json, list)

# Test for successfully adding a volunteer event
def test_add_volunteer_event_success(client, valid_event):
    response = client.post('/volunteer-history', json=valid_event)
    assert response.status_code == 201
    assert response.json['eventName'] == valid_event['eventName']

# Test for adding an event with a missing required field
def test_add_volunteer_event_missing_field(client, event_missing_field):
    response = client.post('/volunteer-history', json=event_missing_field)
    assert response.status_code == 400
    assert "eventName is required" in response.json['error']

# Test for adding an event with invalid urgency
def test_add_volunteer_event_invalid_urgency(client, valid_event):
    invalid_event = valid_event.copy()
    invalid_event["urgency"] = "Critical"  # Invalid urgency
    response = client.post('/volunteer-history', json=invalid_event)
    assert response.status_code == 400
    assert "urgency must be one of" in response.json['error']
