# Import modules / classes here
from .Login import login_bp

def register_routes(app):
    app.register_blueprint(login_bp, url_prefix='/auth')