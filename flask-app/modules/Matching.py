from flask import Blueprint, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
import json

matching_bp = Blueprint("matching", __name__)
CORS(matching_bp) 

@matching_bp.route("/match/<int:event_id>", methods=["POST"])
def match_volunteers(event_id):
    mysql = MySQL()
    cur = mysql.connection.cursor()
    
    cur.execute(""" 
        SELECT e.event_id, e.event_name, e.event_date, e.event_urgency, u.urgency_name, e.event_city, e.event_skills 
        FROM event e 
        JOIN urgency u ON e.event_urgency = u.urgency_id 
        WHERE e.event_id = %s 
    """, (event_id,))
    
    event = cur.fetchone()
    if not event:
        return jsonify({"error": "Event not found"}), 404


    event_skill_ids = json.loads(event[6]) if event[6] else []


    event_date_str = event[2].strftime("%Y-%m-%d")

    cur.execute("SELECT * FROM volunteer")
    volunteers = cur.fetchall()

    matched_volunteers = []
    for volunteer in volunteers:
        volunteer_skills = json.loads(volunteer[9]) if volunteer[9] else []

        availability = volunteer[6]
        if isinstance(availability, str):
            availability = json.loads(availability)

        if not isinstance(availability, list):
            availability = []

        print(f"Checking volunteer: {volunteer[1]}, City: {volunteer[3]}, Skills: {volunteer_skills}, Availability: {availability}")


        if (volunteer[3] == event[5] and  
            event_date_str in availability and
            all(skill in volunteer_skills for skill in event_skill_ids)):
            
            matched_volunteers.append({
                "volunteerId": volunteer[0],
                "eventId": event[0],
                "volunteerName": volunteer[1],
                "eventTitle": event[1],
                "date": event_date_str,
                "priority": event[4],
            })
            save_match(volunteer[0], event[0])  

    print(f"Matched volunteers for event {event_id}: {matched_volunteers}") 
    
    return jsonify(matched_volunteers), 200

def clear_previous_matches(event_id):
    mysql = MySQL()
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM matches WHERE matched_event_id = %s", (event_id,))
    mysql.connection.commit()
    cur.close()

def save_match(volunteer_id, event_id):
    mysql = MySQL()
    cur = mysql.connection.cursor()
    
    cur.execute("SELECT * FROM matches WHERE matched_event_id = %s AND matched_user_id = %s", (event_id, volunteer_id))
    if cur.fetchone() is not None:
        cur.close()  
        return 
    
    cur.execute("INSERT INTO matches (matched_event_id, matched_user_id) VALUES (%s, %s)", (event_id, volunteer_id))
    mysql.connection.commit()
    cur.close()

@matching_bp.route("/matches", methods=["GET"])
def get_matches():
    mysql = MySQL()
    cur = mysql.connection.cursor()
    
    cur.execute("""
        SELECT e.event_id, e.event_name, e.event_date, u.urgency_name
        FROM event e
        JOIN urgency u ON e.event_urgency = u.urgency_id
        WHERE e.event_finished = 0
    """)
    events = cur.fetchall()
    
    matches = {}
    for event in events:
        cur.execute("""
            SELECT v.volunteer_full_name, m.matched_user_id
            FROM matches m
            JOIN volunteer v ON m.matched_user_id = v.volunteer_id
            WHERE m.matched_event_id = %s
        """, (event[0],))
        matched_volunteers = cur.fetchall()
        matches[event[0]] = matched_volunteers
    
    cur.close()

    events_list = [
        {
            "id": event[0],
            "title": event[1],
            "date": event[2].strftime("%m-%d-%Y"),
            "priority": event[3],
            "matched_volunteers": matches.get(event[0], []), 
        } for event in events
    ]
    
    return jsonify(events_list), 200



@matching_bp.route("/matches/<int:event_id>/<int:volunteer_id>", methods=["DELETE"])
def delete_match(event_id, volunteer_id):
    mysql = MySQL()
    cur = mysql.connection.cursor()
    
    cur.execute("DELETE FROM matches WHERE matched_event_id = %s AND matched_user_id = %s", (event_id, volunteer_id))
    mysql.connection.commit()
    
    if cur.rowcount == 0:
        return jsonify({"error": "Match not found"}), 404
    
    cur.close()
    return jsonify({"message": "Match deleted successfully"}), 200
