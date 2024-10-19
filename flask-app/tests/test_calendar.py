import pytest
from flask import Flask
from modules.Calendar import calendar_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(calendar_bp) 
    app.config['TESTING'] = True  
    with app.test_client() as client:
        yield client 
def test_get_matches(client):
    response = client.get("/events")
    assert response.status_code == 200
    assert response.json == [
        {"id": 1, "title": "Group Project", "date": "10/01/2024", "city": "Houston", "priority": "High"},
        {"id": 2, "title": "Class Meeting", "date": "10/05/2024", "city": "Beijing", "priority": "Med"},
        {"id": 3, "title": "Homework Review", "date": "10/10/2024", "city": "Dallas", "priority": "Low"},
    ]

