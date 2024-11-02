from flask import Blueprint, request, jsonify, session, current_app 
from flask_marshmallow import Marshmallow
from marshmallow import fields, ValidationError
from datetime import datetime
from .Auth import login_required
import App

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

    location = fields.String(
        required=True,
        validate=lambda s: 1 <= len(s) <= 500,
        error_messages={
            "validator_failed": "Event description must be between 1 - 500 characters.",
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

    date = fields.Number(
        required=True,
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
            cur = management_bp.mysql.connection.cursor()
            cur.execute("""
            INSERT INTO event (event_name, event_description, event_location, event_skill, event_urgency, event_date)    
            VALUES (%s, %s, %s, %s, %s, %s)
            """, [
               data.get("name"), 
               data.get("description"), 
               data.get("location"), 
               data.get("skills"),
               data.get("urgency"),
               data.get("date")
            ]
            )
            management_bp.mysql.connection.commit()
            cur.close()

        except ValidationError as error:
            return jsonify({"errors": error.messages}), 400

        event_info[user_id] = {
            "name": data.get("name"),
            "description": data.get("description"),
            "location": data.get("location"),
            "skills": data.get("skills"),
            "urgency": data.get("urgency"),
            "date": data.get("date"),
        }

        return jsonify({"msg": "Event saved successfully!"}), 200