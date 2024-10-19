import pytest
from flask import Flask
from modules.Matching import matching_bp  

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(matching_bp) 
    app.config['TESTING'] = True  
    with app.test_client() as client:
        yield client  

def test_match_volunteers(client):
    response = client.post("/match/1") 
    assert response.status_code == 200

    expected_response = [
        {
            "volunteerId": 1,
            "eventId": 1,
            "volunteerName": "Tuan",
            "eventTitle": "Group Project",
            "date": "10/01/2024",
            "priority": "High"
        }
    ]
    assert response.json == expected_response

def test_match_event_not_found(client):
    response = client.post("/match/999")  
    assert response.status_code == 404
    assert response.json == {"error": "Event not found"}

def test_get_matches(client):
    response = client.get("/matches")
    assert response.status_code == 200
    assert response.json == [
        {"id": 1, "title": "Group Project", "date": "10/01/2024", "city": "Houston", "skills": ["Gamer"], "preferences": [], "priority": "High"},
        {"id": 2, "title": "Class Meeting", "date": "10/05/2024", "city": "Beijing", "skills": ["Discord"], "preferences": [], "priority": "Med"},
        {"id": 3, "title": "Homework Review", "date": "10/10/2024", "city": "Dallas", "skills": ["Sleep"], "preferences": [], "priority": "Low"},
    ]
