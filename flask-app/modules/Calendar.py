from flask import Blueprint, request, jsonify

calendar_bp = Blueprint("calendar", __name__)

cal_events = [
    {"id": 1, "title": "Group Project", "date": "10/01/2024", "city": "Houston", "priority": "High"},
    {"id": 2, "title": "Class Meeting", "date": "10/05/2024", "city": "Beijing", "priority": "Med"},
    {"id": 3, "title": "Homework Review", "date": "10/10/2024", "city": "Dallas", "priority": "Low"},
]

@calendar_bp.route("/events", methods=["GET"])
def get_matches():
    print("Received a request to /events")
    return jsonify(cal_events), 200