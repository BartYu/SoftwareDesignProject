from flask import Flask
from .Login import login_bp
from .Profile import profile_bp  # Import the profile blueprint
from .volunteer import volunteer_bp

def create_app():
    app = Flask(__name__)
    app.secret_key = 'your_secret_key'  # Use a strong secret key
    register_routes(app)
    return app

def register_routes(app):
    app.register_blueprint(login_bp, url_prefix="/auth")
    app.register_blueprint(profile_bp, url_prefix="/user")  # Register profile blueprint
    app.register_blueprint(volunteer_bp, url_prefix="/volunteers")
