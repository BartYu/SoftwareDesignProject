from flask import Blueprint, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
from datetime import datetime, timedelta

notification_bp = Blueprint("notification", __name__)
CORS(notification_bp)

def get_upcoming_event_notifications(mysql):
    now = datetime.now()
    three_days_later = now + timedelta(days=3)

    cursor = mysql.connection.cursor()

    cursor.execute("""
        SELECT event_id, event_name, event_date 
        FROM event 
        WHERE event_date BETWEEN %s AND %s
    """, (now, three_days_later))

    events = cursor.fetchall()
    cursor.close()

    notifications = []
    for event in events:
        event_date_str = event[2].strftime('%m/%d/%Y') 
        notifications.append({
            "id": event[0],  
            "title": f"Event '{event[1]}' is happening soon",  
            "date": event_date_str,  
            "event_id": event[0] 
        })

    return notifications

def get_new_event_notifications(mysql):
    now = datetime.now()

    cursor = mysql.connection.cursor()

    cursor.execute("""
        SELECT event_id, event_name, event_date 
        FROM event 
        WHERE event_date > %s
        ORDER BY event_date DESC
        LIMIT 5
    """, (now,))

    events = cursor.fetchall()
    cursor.close()

    notifications = []
    for event in events:
        event_date_str = event[2].strftime('%m/%d/%Y') 
        notifications.append({
            "id": event[0],
            "title": f"New event created: {event[1]}", 
            "date": event_date_str, 
            "event_id": event[0] 
        })

    return notifications

@notification_bp.route("/notif_events", methods=["GET"])
def get_notifications():
    mysql = notification_bp.mysql

    upcoming_notifications = get_upcoming_event_notifications(mysql)
    
    new_event_notifications = get_new_event_notifications(mysql)

    all_notifications = upcoming_notifications + new_event_notifications

    return jsonify(all_notifications), 200
