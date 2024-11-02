from flask import Blueprint, request, jsonify, session, current_app 
from flask_marshmallow import Marshmallow
from marshmallow import fields, ValidationError
from datetime import datetime
from .Auth import login_required
import App
import json

management_bp = Blueprint("management", __name__)
ma = Marshmallow(App)

class datesFormat(fields.Date):
    def _deserialize(self, value, attr, data, **kwargs):
        # print("Dates received: ", value)
        try:
            if isinstance(value, int):
                timestamp = value / 1000
                date_value = datetime.fromtimestamp(timestamp).date()
            else:
                date_value = datetime.strptime(value, "%m/%d/%Y").date()

            return date_value
        except ValueError:
            raise ValidationError("Invalid date format. Expected MM/DD/YYYY.")

class ManagementSchema(ma.Schema):
    name = fields.String(
        required=True,
        validate=lambda s: 1 <= len(s) <= 50,
        error_messages={
            "validator_failed": "Event name must be between 1 - 50 characters.",
        },
    )

    description = fields.String(
        required=True,
        validate=lambda s: 1 <= len(s) <= 500,
        error_messages={
            "validator_failed": "Event description must be between 1 - 500 characters.",
        },
    )

    address = fields.String(
        required=True,
        validate=lambda s: 1 <= len(s) <= 500,
        error_messages={
            "validator_failed": "Address must be between 1 - 500 characters.",
        },
    )

    city = fields.String(
        required=True,
        validate=lambda s: 1 <= len(s) <= 100,
        error_messages={
            "validator_failed": "City must be between 1 - 100 characters.",
        },
    )

    state = fields.String(
        required=True,
        validate=lambda s: 1 <= len(s) <= 100,
        error_messages={
            "validator_failed": "State must be between 1 - 100 characters.",
        },
    )

    zipcode = fields.String(
        required=True,
        validate=lambda s: 1 <= len(s) <= 20,
        error_messages={
            "validator_failed": "Zipcode must be between 1 - 20 characters.",
        },
    )

    skills = fields.List(
        fields.String(),
        required=True,
        validate=lambda s: len(s) > 0,
        error_messages={
            "validator_failed": "Select at least 1 skill.",
        },
    )

    urgency = fields.String(
        required=True,
        error_messages={
            "validator_failed": "Select at least 1 urgency option.",
        },
    )

    date = fields.List(
        datesFormat(),
        required=True,
        validate=lambda s: len(s) > 0,
        error_messages={
            "validator_failed": "Select at least a date.",
        },
    )

management_schema = ManagementSchema()
event_info = {}

@management_bp.route("/management", methods=["POST"])
def management():
    user_id = session.get("user_id")

    if request.method == "POST":
        try:
            data = management_schema.load(request.json)
            print("Event data", data)
            
            urgency_name = data.get("urgency")
            
            cursor = management_bp.mysql.connection.cursor()
            cursor.execute("""
                SELECT urgency_id FROM urgency WHERE urgency_name = %s
            """, [urgency_name])
            urgency_result = cursor.fetchone()
            
            if not urgency_result:
                return jsonify({"error": "Invalid urgency name"}), 400
            
            state_name = data.get("state")
            cursor.execute("SELECT state_id FROM state WHERE state_name = %s", (state_name,))
            state_result = cursor.fetchone()
            
            state_id = state_result[0]
            urgency_id = urgency_result[0]
            event_skills = json.dumps(data.get("skills"))
            event_date_list = data.get("date")
            event_date = event_date_list[0] if event_date_list else None
            
            cursor.execute("""
                INSERT INTO event (event_name, event_description, event_address, event_city, event_state, 
                                   event_zipcode, event_skills, event_urgency, event_date)    
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, [
               data.get("name"), 
               data.get("description"), 
               data.get("address"),
               data.get("city"),
               state_id,
               data.get("zipcode"),
               event_skills,
               urgency_id,
               event_date
            ])
            management_bp.mysql.connection.commit()
            cursor.close()

        except ValidationError as error:
            return jsonify({"errors": error.messages}), 400

        return jsonify({"msg": "Event created successfully!"}), 200
