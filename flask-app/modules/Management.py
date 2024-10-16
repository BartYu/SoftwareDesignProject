from flask import Blueprint, request, jsonify, session
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

    urgency = fields.List(
        fields.String(),
        required=True,
        validate=lambda s: len(s) > 0,
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

@management_bp.route("/management", methods=["GET", "PUT"])
@login_required
def management():
    user_id = session.get("user_id")

    if request.method == "PUT":
        try:
            data = management_schema.load(request.json)
        except ValidationError as error:
            return jsonify({"errors": error.messages}), 400

        # To be sent to database
        event_info[user_id] = {
            "name": data.get("name"),
            "description": data.get("description"),
            "location": data.get("location"),
            "skills": data.get("skills"),
            "urgency": data.get("urgency"),
            "date": data.get("date"),
        }
        return jsonify({"msg": "Event saved successfully!"}), 200

    if request.method == "GET":
        management_info = event_info.get(user_id)
        if management_info:
            return jsonify(management_info), 200
        return jsonify({"msg": "Event not found."}), 404