import pytest
from flask import Flask
from modules.Notification import notification_bp
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(notification_bp)
    app.config['TESTING'] = True
    notification_bp.mysql = MagicMock() 
    with app.test_client() as client:
        yield client

@patch("modules.Notification.datetime")
def test_get_upcoming_event_notifications(mock_datetime, client):
    mock_now = datetime(2023, 11, 20, 12, 0, 0)
    mock_datetime.now.return_value = mock_now

    mock_mysql = notification_bp.mysql
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [
        (1, "Upcoming Event 1", mock_now + timedelta(days=2)),
        (2, "Upcoming Event 2", mock_now + timedelta(days=1)),
    ]
    mock_mysql.connection.cursor.return_value = mock_cursor

    response = client.get("/notif_events")

    assert response.status_code == 200
    assert response.json == [
        {"id": 1, "title": "Event 'Upcoming Event 1' is happening soon", "date": "11/22/2023", "event_id": 1},
        {"id": 2, "title": "Event 'Upcoming Event 2' is happening soon", "date": "11/21/2023", "event_id": 2},
    ]

    mock_cursor.close.assert_called_once()

@patch("modules.Notification.datetime")
def test_get_new_event_notifications(mock_datetime, client):
    mock_now = datetime(2023, 11, 20, 12, 0, 0)
    mock_datetime.now.return_value = mock_now

    mock_mysql = notification_bp.mysql
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [
        (3, "New Event 1", mock_now + timedelta(days=5)),
        (4, "New Event 2", mock_now + timedelta(days=6)),
    ]
    mock_mysql.connection.cursor.return_value = mock_cursor

    response = client.get("/notif_events")

    assert response.status_code == 200
    assert response.json == [
        {"id": 3, "title": "New event created: New Event 1", "date": "11/25/2023", "event_id": 3},
        {"id": 4, "title": "New event created: New Event 2", "date": "11/26/2023", "event_id": 4},
    ]

    mock_cursor.close.assert_called_once()

@patch("modules.Notification.datetime")
def test_get_all_notifications(mock_datetime, client):
    mock_now = datetime(2023, 11, 20, 12, 0, 0)
    mock_datetime.now.return_value = mock_now

    mock_mysql = notification_bp.mysql
    mock_cursor = MagicMock()

    mock_cursor.fetchall.side_effect = [
        [
            (1, "Upcoming Event 1", mock_now + timedelta(days=2)),
            (2, "Upcoming Event 2", mock_now + timedelta(days=1)),
        ],
        [
            (3, "New Event 1", mock_now + timedelta(days=5)),
            (4, "New Event 2", mock_now + timedelta(days=6)),
        ],
    ]
    mock_mysql.connection.cursor.return_value = mock_cursor

    response = client.get("/notif_events")

    assert response.status_code == 200
    assert response.json == [
        {"id": 1, "title": "Event 'Upcoming Event 1' is happening soon", "date": "11/22/2023", "event_id": 1},
        {"id": 2, "title": "Event 'Upcoming Event 2' is happening soon", "date": "11/21/2023", "event_id": 2},
        {"id": 3, "title": "New event created: New Event 1", "date": "11/25/2023", "event_id": 3},
        {"id": 4, "title": "New event created: New Event 2", "date": "11/26/2023", "event_id": 4},
    ]

    assert mock_cursor.close.call_count == 2 
