import pytest
from flask import Flask
from modules.Notification import notification_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(notification_bp) 
    app.config['TESTING'] = True  
    with app.test_client() as client:
        yield client 
def test_get_matches(client):
    response = client.get("/notif_events")
    assert response.status_code == 200
    assert response.json == [
        {"id": 1, "title": 'Upcoming Event: "Homework"'},
        {"id": 2, "title": 'Reminder: "New Event Assigned"'},
    ]
