from flask import Blueprint, request, jsonify

matching_bp = Blueprint("matching", __name__)

# Simulated database for events and volunteers
events = [
    {"id": 1, "title": "Group Project", "date": "10/01/2024", "city": "Houston", "skills": ["Gamer"], "preferences": [], "priority": "High"},
    {"id": 2, "title": "Class Meeting", "date": "10/05/2024", "city": "Beijing", "skills": ["Discord"], "preferences": [], "priority": "Med"},
    {"id": 3, "title": "Homework Review", "date": "10/10/2024", "city": "Dallas", "skills": ["Sleep"], "preferences": [], "priority": "Low"},
]


volunteers = [
    {"id": 1, "name": "Tuan", "available_dates": ["10/01/2024"], "city": "Houston", "skills": ["Gamer"], "preferences": []},
    {"id": 2, "name": "Annie", "available_dates": ["10/05/2024"], "city": "Beijing", "skills": ["Discord"], "preferences": []},
    {"id": 3, "name": "Zayed", "available_dates": ["10/05/2024"], "city": "Dallas", "skills": ["Sleep"], "preferences": []},
]

matches = []

@matching_bp.route("/match", methods=["POST"])
def match_volunteers():
    global matches
    matches.clear()
    
    priority_order = {"High": 1, "Med": 2, "Low": 3}
    sorted_events = sorted(events, key=lambda x: priority_order[x['priority']])

    for volunteer in volunteers:
        for event in sorted_events:
            if (volunteer['city'] == event['city'] and
                event['date'] in volunteer['available_dates'] and
                any(skill in volunteer['skills'] for skill in event['skills'])):
                matches.append({
                    "volunteerId": volunteer['id'],
                    "eventId": event['id'],
                    "volunteerName": volunteer['name'],
                    "eventTitle": event['title'],
                    "date": event['date'],
                    "priority": event['priority']  
                })
    
    return jsonify(matches), 200

@matching_bp.route("/matches", methods=["GET"])
def get_matches():
    print("Received a request to /match")
    return jsonify(matches), 200
