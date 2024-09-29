def register_routes(app):
    # Import modules / classes here
    from .Login import login_bp
    from .Profile import profile_bp

    app.register_blueprint(login_bp, url_prefix="/auth")
    app.register_blueprint(profile_bp, url_prefix="/user")
