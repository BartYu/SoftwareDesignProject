from datetime import datetime
from flask import Blueprint, request, jsonify, session
from flask_marshmallow import Marshmallow
from marshmallow import fields, validates, ValidationError
from datetime import datetime
from .Auth import login_required
import re
import App

profile_bp = Blueprint("profile", __name__)

ma = Marshmallow(App)


class datesFormat(fields.Date):
    def _deserialize(self, value, attr, data, **kwargs):
        try:
            return datetime.strptime(value, "%m/%d/%Y").date()
        except ValueError:
            raise ValidationError("Invalid date format. Expected MM/DD/YYYY.")


class ProfileSchema(ma.Schema):
    name = fields.String(
        required=True,
        validate=lambda s: 1 <= len(s) <= 50,
        error_messages={
            "validator_failed": "Full name must be between 1 - 50 characters.",
        },
    )
    address1 = fields.String(
        required=True,
        validate=lambda s: 1 <= len(s) <= 100,
        error_messages={
            "validator_failed": "Address must be between 1 - 100 characters.",
        },
    )
    address2 = fields.String(allow_none=True, validate=lambda s: len(s) <= 100)
    city = fields.String(
        required=True,
        validate=lambda s: 1 <= len(s) <= 100,
        error_messages={
            "validator_failed": "Enter a valid city",
        },
    )
    state = fields.String(
        required=True,
        validate=lambda s: len(s) == 2,
        error_messages={
            "validator_failed": "Select your State.",
        },
    )
    zip = fields.String(
        required=True,
        validate=lambda s: re.match(r"^\d{5}(-\d{4})?$", s) is not None,
        error_messages={
            "required": "Enter a valid zip code.",
            "validator_failed": "Zip code must be in the format XXXXX or XXXXX-XXXX.",
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
    preferences = fields.String(allow_none=True, validate=lambda s: len(s) <= 300)
    dates = fields.List(
        datesFormat(),
        required=True,
        validate=lambda s: len(s) > 0,
        error_messages={
            "validator_failed": "Select at least a date.",
        },
    )


profile_schema = ProfileSchema()
user_profile = {}


@profile_bp.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    user_id = session.get("user_id")
    # print("Profile session:", session.get("user_id"))

    if request.method == "POST":
        # print("Request JSON:", request.json)
        try:
            data = profile_schema.load(request.json)
        except ValidationError as error:
            return jsonify({"errors": error.messages}), 400

        # To be sent to database
        user_profile[user_id] = {
            "name": data.get("name"),
            "address1": data.get("address1"),
            "address2": data.get("address2"),
            "city": data.get("city"),
            "state": data.get("state"),
            "zip": data.get("zip"),
            "skills": data.get("skills"),
            "preferences": data.get("preferences"),
            "dates": data.get("dates"),
        }
        return jsonify({"msg": "Profile saved successfully!"}), 201

    if request.method == "GET":
        profile_info = user_profile.get(user_id)
        # print("Profile:", profile_info)
        if profile_info:
            return jsonify(profile_info), 200
        return jsonify({"msg": "Profile not found."}), 404
