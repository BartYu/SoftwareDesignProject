from flask import Flask
from flask_cors import CORS
from modules import register_routes
from datetime import timedelta

def create_app():
    app = Flask(__name__)
    app.secret_key = "gnaohnautcosc"
    app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=1)

    CORS(app, supports_credentials=True)

    register_routes(app)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5005)
