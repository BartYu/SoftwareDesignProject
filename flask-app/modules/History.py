from flask import Flask, jsonify, request

app = Flask(__name__)

# Sample volunteer data
volunteer_data = [
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

# Validation function
def validate_volunteer_data(data):
    errors = {}
    if not data.get("eventName"):
        errors["eventName"] = "Event name is required."
    if not data.get("eventDescription"):
        errors["eventDescription"] = "Event description is required."
    if not data.get("location"):
        errors["location"] = "Location is required."
    if not data.get("eventDate"):
        errors["eventDate"] = "Event date is required."
    return errors

# Route to fetch volunteer data
@app.route('/api/volunteers', methods=['GET'])
def get_volunteers():
    return jsonify(volunteer_data), 200

# Route to add new volunteer data (for demonstration)
@app.route('/api/volunteers', methods=['POST'])
def add_volunteer():
    new_volunteer = request.json
    errors = validate_volunteer_data(new_volunteer)
    if errors:
        return jsonify({"errors": errors}), 400

    volunteer_data.append(new_volunteer)
    return jsonify(new_volunteer), 201

if __name__ == '__main__':
    app.run(debug=True)
