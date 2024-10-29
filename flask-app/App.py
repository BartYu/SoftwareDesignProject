from flask import Flask
from flask_cors import CORS
from modules import register_routes
from datetime import timedelta
from flask_mysqldb import MySQL

def create_app():
    app = Flask(__name__)
    app.secret_key = "gnaohnautcosc"
    app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=1)
    
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root'  # replace w/ ur data
    app.config['MYSQL_PASSWORD'] = 'Team4-3380:'  # replace w/ ur data
    app.config['MYSQL_DB'] = 'software_volunteering'  # replace w/ ur database name 

    mysql = MySQL(app)
    
    CORS(app, supports_credentials=True)

    register_routes(app, mysql)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5005)
