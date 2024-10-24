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
    eventName = fields.String(required=True, validate=validate.Length(min=1))
    eventDescription = fields.String(required=True)
    location = fields.String(required=True)
    requiredSkills = fields.String(required=True)
    urgency = fields.String(required=True, validate=validate.OneOf(["Low", "Medium", "High"]))
    eventDate = fields.Date(required=True)  # Ensure date validation
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

        # Check for duplicates
        if any(event['eventName'] == data['eventName'] for event in volunteer_history):
            return jsonify({"error": "Event already exists"}), 400

        # Append data and convert date to string format
        event_data = {
            **data,
            "eventDate": data['eventDate'].isoformat()  # Convert to string format
        }
        volunteer_history.append(event_data)
        return jsonify(event_data), 201
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
