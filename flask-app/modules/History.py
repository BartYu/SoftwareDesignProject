from flask import Blueprint, jsonify, request
from marshmallow import Schema, fields, validate, ValidationError

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

class VolunteerEventSchema(Schema):
    eventName = fields.String(required=True)
    eventDescription = fields.String(required=True)
    location = fields.String(required=True)
    requiredSkills = fields.String(required=True)
    urgency = fields.String(required=True, validate=validate.OneOf(["Low", "Medium", "High"]))
    eventDate = fields.String(required=True)  # Use fields.Date for better date handling if necessary
    participationStatus = fields.String(required=True)

@history_bp.route('/volunteer-history', methods=['GET'])
def get_volunteer_history():
    return jsonify(volunteer_history)

@history_bp.route('/volunteer-history', methods=['POST'])
def add_volunteer_event():
    schema = VolunteerEventSchema()

    try:
        # Validate and deserialize input data
        data = schema.load(request.json)
        volunteer_history.append(data)
        return jsonify(data), 201
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
