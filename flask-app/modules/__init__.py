# Import modules / classes here
from .Login import login_bp
from .Matching import matching_bp
from .Profile import profile_bp

def register_routes(app):
    app.register_blueprint(login_bp, url_prefix='/auth')
    app.register_blueprint(matching_bp, url_prefix='/macho')
    app.register_blueprint(profile_bp, url_prefix="/user")
