from flask import Blueprint, jsonify, request
from marshmallow import Schema, fields, validate, ValidationError, pre_load
import re
import json
from datetime import datetime

history_bp = Blueprint('history', __name__)

class VolunteerEventSchema(Schema):
    eventName = fields.String(required=True)
    eventDescription = fields.String(required=True)
    location = fields.String(required=True, validate=validate.Length(min=1))
    eventDate = fields.Date(required=True)
    participationStatus = fields.String(required=True)

    @pre_load
    def validate_location_format(self, data, **kwargs):
        location = data.get('location', '')
        if not self.is_valid_location(location):
            raise ValidationError("Location must include street, city, state, and ZIP code.")
        return data

    @staticmethod
    def is_valid_location(location):
        return bool(re.match(r'^\d+ .+, .+, [A-Z]{2}, \d{5}$', location))

@history_bp.route('/volunteer-history', methods=['GET'])
def get_volunteer_history():
    cursor = history_bp.mysql.connection.cursor()
    cursor.execute("""
        SELECT 
            e.event_name, 
            e.event_description, 
            e.event_address, 
            e.event_city, 
            s.state_name, 
            e.event_zipcode, 
            e.event_date,
        FROM 
            event e
        JOIN 
            state s ON e.event_state = s.state_id 
        WHERE 
            e.event_finished = 1
    """)
    finished_events = cursor.fetchall()
    cursor.close()

    serialized_events = [
        {
            "eventName": event[0],
            "eventDescription": event[1],
            "location": f"{event[2]}, {event[3]}, {event[4]}, {event[5]}",
            "eventDate": event[6].strftime('%m-%d-%y'), 
            "participationStatus": "Completed",  
        }
        for event in finished_events
    ]

    return jsonify(serialized_events)
