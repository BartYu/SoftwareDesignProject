import pytest
from flask import Flask
from unittest.mock import patch, MagicMock
from modules.Matching import matching_bp
import json
from datetime import datetime

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(matching_bp) 
    app.config['TESTING'] = True  
    with app.test_client() as client:
        yield client

@pytest.fixture
def mock_mysql():
    with patch('modules.Matching.MySQL') as mock_mysql:
        mock_cursor = MagicMock()
        mock_mysql_instance = mock_mysql.return_value
        mock_mysql_instance.connection.cursor.return_value = mock_cursor
        yield mock_cursor, mock_mysql_instance

def test_match_volunteers_successful_scenario(client, mock_mysql):
    cursor, mysql = mock_mysql
    
    cursor.fetchone.side_effect = [
        (1, "Group Project", datetime(2024, 10, 1), 1, "High", "Houston", json.dumps([1])),
        (1, "Tuan", "email@example.com", "Houston", "123-456-7890", "available", "Active", None, None, json.dumps([1])),
    ]
    
    cursor.fetchall.return_value = [
        (1, "Tuan", "email@example.com", "Houston", "123-456-7890", "available", "Active", None, None, json.dumps([1]))
    ]

    response = client.post("/match/1")
    
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]["volunteerName"] == "Tuan"
    assert response.json[0]["eventTitle"] == "Group Project"

def test_match_volunteers_no_match(client, mock_mysql):
    cursor, mysql = mock_mysql
    
    cursor.fetchone.side_effect = [
        (1, "Group Project", datetime(2024, 10, 1), 1, "High", "Houston", json.dumps([999])),
    ]
    
    cursor.fetchall.return_value = [
        (1, "Tuan", "email@example.com", "Dallas", "123-456-7890", "available", "Active", None, None, json.dumps([1]))
    ]

    response = client.post("/match/1")
    
    assert response.status_code == 200
    assert len(response.json) == 0

def test_match_event_not_found(client, mock_mysql):
    cursor, mysql = mock_mysql
    
    cursor.fetchone.return_value = None

    response = client.post("/match/999")
    
    assert response.status_code == 404
    assert response.json == {"error": "Event not found"}

def test_get_matches(client, mock_mysql):
    cursor, mysql = mock_mysql
    
    cursor.fetchall.side_effect = [
        [
            (1, "Group Project", datetime(2024, 10, 1), "High"),
            (2, "Class Meeting", datetime(2024, 10, 5), "Med"),
            (3, "Homework Review", datetime(2024, 10, 10), "Low")
        ],
        [(1, "Tuan")],
        [(2, "Alice")],
        []
    ]

    response = client.get("/matches")
    
    assert response.status_code == 200
    assert len(response.json) == 3
    
    for event in response.json:
        assert "id" in event
        assert "title" in event
        assert "date" in event
        assert "priority" in event
        assert "matched_volunteers" in event

def test_delete_match(client, mock_mysql):
    cursor, mysql = mock_mysql
    
    cursor.rowcount = 1

    response = client.delete("/matches/1/2")
    
    assert response.status_code == 200
    assert response.json == {"message": "Match deleted successfully"}

def test_delete_match_not_found(client, mock_mysql):
    cursor, mysql = mock_mysql
    
    cursor.rowcount = 0

    response = client.delete("/matches/999/999")
    
    assert response.status_code == 404
    assert response.json == {"error": "Match not found"}