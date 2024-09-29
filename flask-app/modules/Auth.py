from functools import wraps
from flask import session, jsonify


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user" not in session:
            return jsonify({"msg": "Not logged in."}), 401
        return f(*args, **kwargs)

    return decorated_function
