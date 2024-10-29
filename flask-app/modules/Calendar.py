from flask import Blueprint, request, jsonify, current_app

calendar_bp = Blueprint("calendar", __name__)

@calendar_bp.route("/events", methods=["GET"])
def get_events():
    try:
        cur = calendar_bp.mysql.connection.cursor()
        cur.execute("""
            SELECT 
                event.event_id, 
                event.event_name, 
                event.event_city, 
                event.event_urgency, 
                event.event_date, 
                urgency.urgency_name 
            FROM 
                event 
            JOIN 
                urgency ON event.event_urgency = urgency.urgency_id 
            WHERE 
                event.event_finished = 0
        """)
        results = cur.fetchall()

        events = []
        for row in results:
            event = {
                "id": row[0],
                "title": row[1],
                "city": row[2],
                "priority": row[5],
                "date": row[4].isoformat()
            }
            events.append(event)

        cur.close()
        return jsonify(events), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while fetching events"}), 500

@calendar_bp.route("/events", methods=["POST"])
def delete_event(event_id):
    try:
        cur = get_mysql_connection().cursor()
        cur.execute("DELETE FROM event WHERE event_id = %s", (event_id,))
        current_app.mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Event deleted successfully"}), 204
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while deleting the event"}), 500
