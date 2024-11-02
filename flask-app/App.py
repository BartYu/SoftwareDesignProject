from flask import Flask
from flask_cors import CORS
from modules import register_routes
from datetime import timedelta
from flask_mysqldb import MySQL
from dotenv import load_dotenv
import os

def create_app():
    app = Flask(__name__)
    load_dotenv()
    app.secret_key = os.getenv("SECRET_KEY")
    app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=1)
    
    app.config['MYSQL_HOST'] = os.getenv("MYSQL_HOST")
    app.config['MYSQL_USER'] = os.getenv("MYSQL_USER")
    app.config['MYSQL_PASSWORD'] = os.getenv("MYSQL_PASSWORD")
    app.config['MYSQL_DB'] = os.getenv("MYSQL_DB")

    mysql = MySQL(app)
    
    CORS(app, supports_credentials=True)

    register_routes(app, mysql)

    return app
    
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5005)
