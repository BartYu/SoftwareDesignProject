from flask import Blueprint, jsonify, request
from marshmallow import Schema, fields, validate, ValidationError, pre_load
import re  # Import the re module for regex operations

history_bp = Blueprint('history', __name__)

# Hardcoded volunteer history data
volunteer_history = [
    {
        "eventName": "Community Cleanup",
        "eventDescription": "Cleaning up the local park.",
        "location": "123 Main St, Springfield, IL, 62701",  # Updated example location
        "requiredSkills": "Teamwork, Communication",
        "urgency": "High",
        "eventDate": "2024-09-20",
        "participationStatus": "Completed",
    },
    {
        "eventName": "Food Drive",
        "eventDescription": "Collecting food for the needy.",
        "location": "456 Elm St, Downtown Community Center, NY, 12345",  # Updated example location
        "requiredSkills": "Organization, Communication",
        "urgency": "Medium",
        "eventDate": "2024-08-15",
        "participationStatus": "Pending",
    },
]

class VolunteerEventSchema(Schema):
    eventName = fields.String(required=True)
    eventDescription = fields.String(required=True)
    location = fields.String(required=True, validate=validate.Length(min=1))  # Ensure location is not empty
    requiredSkills = fields.String(required=True)
    urgency = fields.String(required=True, validate=validate.OneOf(["Low", "Medium", "High"]))
    eventDate = fields.Date(required=True)  # Using fields.Date for better date handling
    participationStatus = fields.String(required=True)

    @pre_load
    def validate_location_format(self, data, **kwargs):
        location = data.get('location', '')
        # Simple location format validation
        if not self.is_valid_location(location):
            raise ValidationError("Location must include street, city, state, and ZIP code.")
        return data

    @staticmethod
    def is_valid_location(location):
        # Basic check for expected location format
        return bool(re.match(r'^\d+ .+, .+, [A-Z]{2}, \d{5}$', location))

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
        return jsonify({"errors": err.messages}), 400
