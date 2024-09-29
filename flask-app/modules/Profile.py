from flask import Blueprint, request, jsonify, session
from flask_marshmallow import Marshmallow
from marshmallow import fields, validates, ValidationError
from .Auth import login_required
import App

profile_bp = Blueprint("profile", __name__)

ma = Marshmallow(App)


class ProfileSchema(ma.Schema):
    name = fields.String(required=True, validate=lambda s: 1 <= len(s) <= 50)
    address1 = fields.String(required=True, validate=lambda s: 1 <= len(s) <= 100)
    address2 = fields.String(allow_none=True, validate=lambda s: 1 <= len(s) <= 100)
    city = fields.String(required=True, validate=lambda s: 1 <= len(s) <= 100)
    state = fields.String(required=True, validate=lambda s: len(s) == 2)
    zip_code = fields.String(required=True, validate=lambda s: 5 <= len(s) <= 10)
    skills = fields.List(fields.String(), required=True)
    preferences = fields.String(allow_none=True, validate=lambda s: len(s) <= 300)
    dates = fields.List(fields.Date(), required=True)


profile_schema = ProfileSchema()


@profile_bp.route("/profile", methods=["POST"])
# @login_required
def profile():
    try:
        data = profile_schema.load(request.json)
    except ValidationError as error:
        return jsonify(error.messages), 400

    # Save data to database here

    return jsonify({"msg": "Profile saved successfully!"}), 201
