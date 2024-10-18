import pytest
from flask import Flask
from your_application import create_app  # Adjust import based on your app structure

@pytest.fixture
def app():
    app = create_app()  # Create your Flask app
    app.config['TESTING'] = True
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_get_volunteer_history(client):
    response = client.get('/api/volunteer-history', follow_redirects=True)
    assert response.status_code == 200
    data = response.get_json()

    # Check that the response is a list and contains expected fields
    assert isinstance(data, list)
    assert len(data) > 0
    assert 'eventName' in data[0]
    assert 'eventDescription' in data[0]
    assert 'location' in data[0]
    assert 'requiredSkills' in data[0]
    assert 'urgency' in data[0]
    assert 'eventDate' in data[0]
    assert 'participationStatus' in data[0]

def test_add_volunteer_event(client):
    new_event = {
        "eventName": "Test Event",
        "eventDescription": "A test event description.",
        "location": "Test Location",
        "requiredSkills": "Testing",
        "urgency": "Low",
        "eventDate": "2024-10-20",
        "participationStatus": "Pending",
    }
    
    response = client.post('/api/volunteer-history', json=new_event)
    assert response.status_code == 201
    data = response.get_json()
    assert data == new_event

def test_add_event_missing_field(client):
    incomplete_event = {
        "eventName": "Incomplete Event",
        "eventDescription": "This event has no location."
        # Missing location, requiredSkills, urgency, eventDate, participationStatus
    }
    
    response = client.post('/api/volunteer-history', json=incomplete_event)
    assert response.status_code == 400
    data = response.get_json()
    assert "location is required" in data['error']

# Add more tests as needed for other functionalities


