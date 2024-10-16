# history.py
from flask import Blueprint, jsonify, request

history_bp = Blueprint('history', __name__)

# Hardcoded volunteer history data
volunteer_history = [
    {
        "eventName": "Community Cleanup",
        "eventDescription": "Cleaning up the local park.",
        "location": "Central Park",
        "requiredSkills": "Teamwork, Communication",
        "urgency": "High",
        "eventDate": "2024-09-20",
        "participationStatus": "Completed",
    },
    {
        "eventName": "Food Drive",
        "eventDescription": "Collecting food for the needy.",
        "location": "Downtown Community Center",
        "requiredSkills": "Organization, Communication",
        "urgency": "Medium",
        "eventDate": "2024-08-15",
        "participationStatus": "Pending",
    },
]

@history_bp.route('/volunteer-history', methods=['GET'])
def get_volunteer_history():
    return jsonify(volunteer_history)

@history_bp.route('/volunteer-history', methods=['POST'])
def add_volunteer_event():
    data = request.json
    required_fields = ["eventName", "eventDescription", "location", "requiredSkills", "urgency", "eventDate", "participationStatus"]

    # Validate required fields
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    volunteer_history.append(data)
    return jsonify(data), 201
