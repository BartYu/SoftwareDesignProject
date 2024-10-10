from flask import Blueprint, request, jsonify, session
from flask_marshmallow import Marshmallow
from marshmallow import fields, ValidationError
from datetime import datetime
from .Auth import login_required
import re
import App

profile_bp = Blueprint("profile", __name__)
ma = Marshmallow(App)

class DatesFormat(fields.Date):
    def _deserialize(self, value, attr, data, **kwargs):
        try:
            if isinstance(value, int):
                timestamp = value / 1000
                date_value = datetime.fromtimestamp(timestamp).date()
            else:
                date_value = datetime.strptime(value, "%m/%d/%Y").date()
            return date_value
        except ValueError:
            raise ValidationError("Invalid date format. Expected MM/DD/YYYY.")

class ProfileSchema(ma.Schema):
    name = fields.String(required=True, validate=lambda s: 1 <= len(s) <= 50)
    address1 = fields.String(required=True, validate=lambda s: 1 <= len(s) <= 100)
    address2 = fields.String(allow_none=True, validate=lambda s: len(s) <= 100)
    city = fields.String(required=True, validate=lambda s: 1 <= len(s) <= 100)
    state = fields.String(required=True, validate=lambda s: len(s) == 2)
    zipcode = fields.String(required=True, validate=lambda s: re.match(r"^\d{5}(-\d{4})?$", s) is not None)
    skills = fields.List(fields.String(), required=True, validate=lambda s: len(s) > 0)
    preferences = fields.String(allow_none=True, validate=lambda s: len(s) <= 300)
    dates = fields.List(DatesFormat(), required=True, validate=lambda s: len(s) > 0)

profile_schema = ProfileSchema()
user_profile = {}

@profile_bp.route("/profile", methods=["GET", "PUT"])
@login_required
def profile():
    user_id = session.get("user_id")

    if request.method == "PUT":
        try:
            data = profile_schema.load(request.json)
        except ValidationError as error:
            return jsonify({"errors": error.messages}), 400

        user_profile[user_id] = {
            "name": data.get("name"),
            "address1": data.get("address1"),
            "address2": data.get("address2"),
            "city": data.get("city"),
            "state": data.get("state"),
            "zipcode": data.get("zipcode"),
            "skills": data.get("skills"),
            "preferences": data.get("preferences"),
            "dates": sorted(data.get("dates", [])),
        }
        return jsonify({"msg": "Profile saved successfully!"}), 200

    if request.method == "GET":
        profile_info = user_profile.get(user_id)
        if profile_info:
            return jsonify(profile_info), 200
        return jsonify({"msg": "Profile not found."}), 404
