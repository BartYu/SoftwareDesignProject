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
        return jsonify({"error fetching"}), 500

@calendar_bp.route("/events/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    try:
        cur = calendar_bp.mysql.connection.cursor()
        
        cur.execute("SELECT * FROM event WHERE event_id = %s", (event_id,))
        if cur.fetchone() is None:
            return jsonify({"error": "Event not found"}), 404

        cur.execute("DELETE FROM event WHERE event_id = %s", (event_id,))
        calendar_bp.mysql.connection.commit()
        cur.close()
    except Exception as e:
        calendar_bp.logger.error(f"Error deleting event {event_id}: {str(e)}")
        return jsonify({"error": f"deletion error {str(e)}"}), 500
