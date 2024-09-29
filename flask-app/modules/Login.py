from flask import Blueprint, request, jsonify
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
    # password = data.get("password")
    # role = data.get("role")

    if email in users:
        return jsonify({"msg": "This email is already registered."}), 400

    # To be implemented with database
    # users[email] = {"password": password, "role": role}
    return jsonify({"msg": "User registered successfully"}), 201


@login_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"error": "Invalid email format."})

    if email in users and users[email]["password"] == password:
        # session["user"] = email
        # session["role"] = users[email]["role"]
        role = users[email]["role"]
        return jsonify({"msg": "Login successful!", "role": role}), 200

    return jsonify({"error": "Invalid credentials"}), 401
