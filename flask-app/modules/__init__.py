def register_routes(app):
    # Import modules / classes here
    from .Login import login_bp
    from .Profile import profile_bp
    from .Management import management_bp

    app.register_blueprint(login_bp, url_prefix="/auth")
    app.register_blueprint(profile_bp, url_prefix="/user")
    app.register_blueprint(management_bp, url_prefix="/event")