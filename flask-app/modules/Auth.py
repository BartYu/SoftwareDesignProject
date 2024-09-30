from functools import wraps
from flask import session, jsonify


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        print("Current session:", session.get("user_id"))
        if "user_id" not in session:
            return jsonify({"error": "Authentication required."}), 401
        return f(*args, **kwargs)

    return decorated_function
