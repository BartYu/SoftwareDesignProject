from flask import Blueprint, request, jsonify, session
import re

login_bp = Blueprint("login", __name__)

# Simulating database
users = {
    "tuan@gmail.com": {"password": "123", "role": "admin"},
    "barton@gmail.com": {"password": "123", "role": "volunteer"},
}


@login_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password or not role:
        return jsonify({"error": "Email, password, and role are required."}), 400

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"error": "Invalid email format."}), 400

    if role not in ["admin", "volunteer"]:
        return jsonify({"error": "Invalid role."}), 400

    if email in users:
        return jsonify({"msg": "This email is already registered."}), 400

    # To be implemented with database
    users[email] = {"password": password, "role": role}
    return jsonify({"msg": "User registered successfully."}), 201


@login_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"error": "Invalid email format."}), 400

    if email in users and users[email]["password"] == password:
        session["user_id"] = email
        session.permanent = True
        if "user_id" in session:
            role = users[email]["role"]
            return jsonify({"msg": "Login successful!", "role": role}), 200

    return jsonify({"error": "Invalid credentials."}), 401


@login_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    print("Logged out. Session:", session.get("user_id"))
    return jsonify({"msg": "Logged out successfully!"}), 200
