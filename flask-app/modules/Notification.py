from flask import Blueprint, request, jsonify

notification_bp = Blueprint("notification", __name__)

notification_events = [
    { "id": 1, "title": 'Upcoming Event: "Homework"' },
    { "id": 2, "title": 'Reminder: "New Event Assigned"' },
]


@notification_bp.route("/notif_events", methods=["GET"])
def get_matches():
    print("Received a request to /notif_events")
    return jsonify(notification_events), 200