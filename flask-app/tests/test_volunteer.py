import pytest

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

def test_get_volunteer_history(client):
    response = client.get('/volunteer-history')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_add_volunteer_event_success(client, valid_event):
    response = client.post('/volunteer-history', json=valid_event)
    assert response.status_code == 201
    assert response.json['eventName'] == valid_event['eventName']

def test_add_volunteer_event_missing_field(client):
    event_missing_field = {
        "eventDescription": "Missing event name.",
        "location": "Community Center",
        "requiredSkills": "Organization",
        "urgency": "Medium",
        "eventDate": "2024-11-01",
        "participationStatus": "Pending",
    }
    response = client.post('/volunteer-history', json=event_missing_field)
    assert response.status_code == 400
    assert 'eventName' in response.json['error']  # Check for the field in the error
    assert 'Missing data for required field.' in response.json['error']['eventName']

def test_add_volunteer_event_invalid_urgency(client, valid_event):
    invalid_event = valid_event.copy()
    invalid_event["urgency"] = "Critical"  # Invalid urgency
    response = client.post('/volunteer-history', json=invalid_event)
    assert response.status_code == 400
    assert 'urgency' in response.json['error']  # Check for the field in the error
    assert 'Must be one of: Low, Medium, High.' in response.json['error']['urgency']
