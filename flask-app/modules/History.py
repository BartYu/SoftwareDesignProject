from flask import Flask, jsonify, request, Blueprint

volunteer_bp = Blueprint('volunteers', __name__)

# Sample volunteer data
volunteer_data = [
    {
        "eventName": "Community Cleanup",
        "eventDescription": "Cleaning up the local park.",
        "location": "Central Park",
        "eventDate": "2024-09-20",
        "participationStatus": "Completed",
    },
    {
        "eventName": "Food Drive",
        "eventDescription": "Collecting food for the needy.",
        "location": "Downtown Community Center",
        "eventDate": "2024-08-15",
        "participationStatus": "Pending",
    },
]

# Route to fetch volunteer data
@volunteer_bp.route('/api/volunteers', methods=['GET'])
def get_volunteers():
    return jsonify(volunteer_data), 200

# Route to add new volunteer data
@volunteer_bp.route('/api/volunteers', methods=['POST'])
def add_volunteer():
    new_volunteer = request.json
    volunteer_data.append(new_volunteer)
    return jsonify(new_volunteer), 201
