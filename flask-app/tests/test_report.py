import pytest
from flask import Flask
from modules.Report import report_bp
from unittest.mock import patch, MagicMock
from datetime import datetime

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(report_bp)
    app.config['TESTING'] = True
    report_bp.mysql = MagicMock()  # Mock MySQL dependency
    with app.test_client() as client:
        yield client

@patch("modules.Report.report_bp.mysql.connection.cursor")
def test_generate_report_volunteer_events_csv(mock_cursor, client):
    mock_cursor.return_value.fetchall.return_value = [
        ("John Doe", "Charity Walk 2023"),
        ("Jane Smith", "Tree Plantation Drive"),
    ]

    response = client.post("/generate_report", data={
        'format': 'csv',
        'report_type': 'volunteer_events_report'
    })

    assert response.status_code == 200
    assert b"Volunteer Name,Event" in response.data 
    assert b"John Doe,Charity Walk 2023" in response.data

@patch("modules.Report.report_bp.mysql.connection.cursor")
def test_generate_report_event_details_pdf(mock_cursor, client):
    mock_cursor.return_value.fetchall.return_value = [
        ("Charity Walk", datetime(2023, 11, 25), "A fundraising walk", "123 Park St",
         "12345", "Springfield", "IL"),
    ]

    response = client.post("/generate_report", data={
        'format': 'pdf',
        'report_type': 'event_details_report'
    })

    assert response.status_code == 200
    assert b"%PDF" in response.data
    assert b"Charity Walk" in response.data
    assert b"11/25/2023" in response.data

@patch("modules.Report.report_bp.mysql.connection.cursor")
def test_generate_report_invalid_format(mock_cursor, client):
    mock_cursor.return_value.fetchall.return_value = []

    response = client.post("/generate_report", data={
        'format': 'xml',  # Unsupported format
        'report_type': 'volunteer_events_report'
    })

    assert response.status_code == 400
    assert b"Invalid format" in response.data

@patch("modules.Report.report_bp.mysql.connection.cursor")
def test_generate_csv(mock_cursor):
    from modules.Report import generate_csv
    mock_cursor.return_value.fetchall.return_value = [
        {"Name": "John Doe", "Event": "Charity Walk 2023"}
    ]

    data = [{"Name": "John Doe", "Event": "Charity Walk 2023"}]
    report_type = "volunteer_events_report"

    response = generate_csv(data, report_type)

    assert response.status_code == 200
    assert "John Doe,Charity Walk 2023" in response.get_data(as_text=True)

@patch("modules.Report.report_bp.mysql.connection.cursor")
def test_generate_pdf(mock_cursor):
    from modules.Report import generate_pdf
    data = [{"event_name": "Charity Walk", "event_date": "November 25, 2023",
             "event_description": "A fundraising walk", "event_address": "123 Park St",
             "event_zipcode": "12345", "event_city": "Springfield", "event_state": "IL"}]
    report_type = "event_details_report"

    response = generate_pdf(data, report_type)

    assert response.status_code == 200
    assert b"%PDF" in response.data
    assert b"Charity Walk" in response.data
