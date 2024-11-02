from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import re

login_bp = Blueprint("login", __name__)


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
    
    user_role = 1 if "admin" in role else 0

    hashed_password = generate_password_hash(password)
    
    # Connect to MySQL
    cursor = login_bp.mysql.connection.cursor()

    # Check if email already exists
    cursor.execute("SELECT * FROM credentials WHERE email = %s", (email,))
    existing_user = cursor.fetchone()
    if existing_user:
        return jsonify({"msg": "This email is already registered."}), 400

    # Insert new user into the database
    cursor.execute(
        "INSERT INTO credentials (email, password, user_role) VALUES (%s, %s, %s)",
        (email, hashed_password, user_role)
    )
    login_bp.mysql.connection.commit() 
    cursor.close()
 
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
    
    # Connect to MySQL
    cursor = login_bp.mysql.connection.cursor()

    cursor.execute("SELECT password, user_role FROM credentials WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()

    if user and check_password_hash(user[0], password):
        session["user_id"] = email
        session.permanent = True
        role = "admin" if user[1] == 1 else "volunteer"
        return jsonify({"msg": "Login successful!", "role": role}), 200

    return jsonify({"error": "Invalid credentials."}), 401


@login_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    print("Logged out. Session:", session.get("user_id"))
    return jsonify({"msg": "Logged out successfully!"}), 200
