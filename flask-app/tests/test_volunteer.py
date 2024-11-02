import pytest

@pytest.fixture(scope='function')
def setup_volunteer_history(client):
    # Initialize or reset your volunteer history for each test
    client.application.volunteer_history = []  # Resetting the volunteer history
    return client

@pytest.fixture
def valid_event():
    return {
        "eventName": "Community Cleanup Unique",
        "eventDescription": "Cleaning up the local park.",
        "location": "123 Main St, Springfield, IL, 62701",  # Updated location format
        "requiredSkills": "Teamwork, Communication",
        "urgency": "High",
        "eventDate": "2024-09-20",
        "participationStatus": "Completed",
    }

@pytest.fixture
def invalid_event():
    return {
        "eventName": "",
        "eventDescription": "Invalid event with no name.",
        "location": "Unknown Location, Nowhere, ZZ, 00000",  # Updated location format
        "requiredSkills": "None",
        "urgency": "Medium",
        "eventDate": "2024-10-01",
        "participationStatus": "Pending",
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
        "location": "456 Elm St, Downtown, NY, 12345",  # Updated location format
        "requiredSkills": "Organization",
        "urgency": "Medium",
        "eventDate": "2024-11-01",
        "participationStatus": "Pending",
    }
    response = client.post('/volunteer-history', json=event_missing_field)
    assert response.status_code == 400
    assert 'eventName' in response.json['errors']  # Adjusted to match the expected structure

def test_add_volunteer_event_invalid_urgency(client, valid_event):
    invalid_event = valid_event.copy()
    invalid_event["urgency"] = "Critical"  
    response = client.post('/volunteer-history', json=invalid_event)
    assert response.status_code == 400
    assert 'urgency' in response.json['errors']  # Adjusted to match the expected structure

def test_add_volunteer_event_invalid_event_name(client, invalid_event):
    response = client.post('/volunteer-history', json=invalid_event)
    assert response.status_code == 400
    assert 'eventName' in response.json['errors']  # Ensure validation catches the empty name

def test_add_volunteer_event_success_with_valid_date(client):
    valid_event_with_future_date = {
        "eventName": "Community Cleanup Unique 2",
        "eventDescription": "Future cleaning event.",
        "location": "789 Oak St, Metropolis, CA, 90210",  # Updated location format
        "requiredSkills": "Teamwork",
        "urgency": "High",
        "eventDate": "2025-12-31",
        "participationStatus": "Pending",
    }
    response = client.post('/volunteer-history', json=valid_event_with_future_date)
    assert response.status_code == 201
    assert response.json['eventDate'] == valid_event_with_future_date['eventDate']

def test_add_volunteer_event_invalid_date_format(client, valid_event):
    invalid_date_event = valid_event.copy()
    invalid_date_event["eventDate"] = "invalid-date-format"  
    response = client.post('/volunteer-history', json=invalid_date_event)
    assert response.status_code == 400
    assert 'eventDate' in response.json['errors']  # Ensure the error is properly handled
