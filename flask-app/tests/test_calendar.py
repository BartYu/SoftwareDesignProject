import pytest
from unittest.mock import MagicMock
from flask import Flask
from modules.Calendar import calendar_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(calendar_bp) 
    app.config['TESTING'] = True  

    calendar_bp.mysql = MagicMock()
    mock_cursor = MagicMock()
    
    mock_cursor.fetchall.return_value = [
        (1, "Group Project", "Houston", 3, "2024-10-01", "High"),
        (2, "Class Meeting", "Beijing", 2, "2024-10-05", "Med"),
        (3, "Homework Review", "Dallas", 1, "2024-10-10", "Low")
    ]
    
    calendar_bp.mysql.connection.cursor.return_value = mock_cursor

    with app.test_client() as client:
        yield client 

def test_get_events(client):
    response = client.get("/events")
    assert response.status_code == 200
    
    expected_events = [
        {"id": 1, "title": "Group Project", "city": "Houston", "priority": "High", "date": "2024-10-01"},
        {"id": 2, "title": "Class Meeting", "city": "Beijing", "priority": "Med", "date": "2024-10-05"},
        {"id": 3, "title": "Homework Review", "city": "Dallas", "priority": "Low", "date": "2024-10-10"}
    ]
    
    assert response.json == expected_events

def test_get_events_database_error(client):
    calendar_bp.mysql.connection.cursor.side_effect = Exception("Database connection error")
    
    response = client.get("/events")
    assert response.status_code == 500
    assert "error" in response.json

@pytest.fixture
def delete_client():
    app = Flask(__name__)
    app.register_blueprint(calendar_bp) 
    app.config['TESTING'] = True  

    calendar_bp.mysql = MagicMock()
    mock_cursor = MagicMock()
    
    calendar_bp.mysql.connection.cursor.return_value = mock_cursor
    
    with app.test_client() as client:
        yield client, mock_cursor

def test_delete_event_success(delete_client):
    client, mock_cursor = delete_client
    
    mock_cursor.fetchone.return_value = (1, "Test Event")
    
    response = client.delete("/events/1")
    assert response.status_code == 200

def test_delete_event_not_found(delete_client):
    client, mock_cursor = delete_client
    
    mock_cursor.fetchone.return_value = None
    
    response = client.delete("/events/999")
    assert response.status_code == 404
    assert "Event not found" in response.json.get("error", "")

def test_delete_event_database_error(delete_client):
    client, mock_cursor = delete_client
    
    mock_cursor.fetchone.side_effect = Exception("Database error")
    
    response = client.delete("/events/1")
    assert response.status_code == 500