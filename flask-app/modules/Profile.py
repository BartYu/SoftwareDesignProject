from flask import Blueprint, request, jsonify, session
from flask_marshmallow import Marshmallow
from marshmallow import fields, ValidationError
from datetime import datetime
from .Auth import login_required
import re
import App
import json

profile_bp = Blueprint("profile", __name__)

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
        validate=lambda s: len(s) < 20,
        error_messages={
            "validator_failed": "Select your State.",
        },
    )
    zipcode = fields.String(
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


@profile_bp.route("/profile", methods=["GET", "PUT"])
@login_required
def profile():
    email = session.get("user_id")
        
    cursor = profile_bp.mysql.connection.cursor()
        
    # Find user_id from credentials table
    cursor.execute("SELECT user_id FROM credentials WHERE email = %s", (email,))
    user_result = cursor.fetchone()

    if not user_result:
        return jsonify({"msg": "User not found."}), 404
    user_id = user_result[0]


    if request.method == "PUT":
        # print("Request JSON:", request.json)
        try:
            data = profile_schema.load(request.json)
        except ValidationError as error:
            return jsonify({"errors": error.messages}), 400

        # Connect to database 
        cursor = profile_bp.mysql.connection.cursor()
        print("Data", data)

         # Fetch state ID based on the provided state name
        state_name = data.get("state")
        cursor.execute("SELECT state_id FROM state WHERE state_name = %s", (state_name,))
        state_result = cursor.fetchone()
        
        state_id = state_result[0]
        # print("state id", state_id)

        # Convert to JSON for backend
        # Convert `availability` (dates list) to JSON string
        availability_dates = data.get("dates")
        availability_json = json.dumps([date.strftime("%Y-%m-%d") for date in availability_dates])
        skills_json = json.dumps(data.get("skills"))
        
        cursor.execute("""
            INSERT INTO volunteer (volunteer_id, volunteer_full_name, volunteer_address_1, volunteer_address_2,
                           volunteer_city, volunteer_state, volunteer_zip_code,
                           volunteer_preferences, volunteer_availability, volunteer_skills)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                volunteer_id = VALUES(volunteer_id),
                volunteer_full_name = VALUES(volunteer_full_name),
                volunteer_address_1 = VALUES(volunteer_address_1),
                volunteer_address_2 = VALUES(volunteer_address_2),
                volunteer_city = VALUES(volunteer_city),
                volunteer_state = VALUES(volunteer_state),
                volunteer_zip_code = VALUES(volunteer_zip_code),
                volunteer_preferences = VALUES(volunteer_preferences),
                volunteer_availability = VALUES(volunteer_availability),
                volunteer_skills = VALUES(volunteer_skills)
        """, (
            user_id,
            data.get("name"),
            data.get("address1"),
            data.get("address2"),
            data.get("city"),
            state_id,
            data.get("zipcode"),
            data.get("preferences"),
            availability_json,
            skills_json,
        ))
        
        profile_bp.mysql.connection.commit()
        cursor.close()
        
        return jsonify({"msg": "Profile saved successfully!"}), 200

    if request.method == "GET":
        cursor.execute("""
            SELECT volunteer_full_name, volunteer_address_1, volunteer_address_2, volunteer_city,
                   volunteer_state, volunteer_zip_code, volunteer_preferences, volunteer_availability, 
                   volunteer_skills
            FROM volunteer
            WHERE volunteer_id = %s
        """, (user_id,))

        profile = cursor.fetchone()
        print("Backend:", profile)

        if not profile:
            cursor.close()
            return jsonify({"msg": "Profile not found."}), 404
        
        # Convert the state id back to the state name
        state_id = profile[4]
        cursor.execute("SELECT state_name FROM state WHERE state_id = %s", (state_id,))
        state_result = cursor.fetchone()

        if state_result:
            state_name = state_result[0]
        else:
            state_name = None
        cursor.close()

        profile_info = {
            "name": profile[0],         
            "address1": profile[1],     
            "address2": profile[2],     
            "city": profile[3],        
            "state": state_name,        
            "zipcode": profile[5],
            "preferences": profile[6],
            # Convert JSON string to dict 
            "dates": json.loads(profile[7]) if profile[7] else {},        
            "skills": json.loads(profile[8]) if profile[8] else {}, 
        }

        return jsonify(profile_info), 200
