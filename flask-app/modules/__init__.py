def register_routes(app):
    from .Login import login_bp
    from .Profile import profile_bp
    from .History import history_bp  

    app.register_blueprint(login_bp, url_prefix="/auth")
    app.register_blueprint(profile_bp, url_prefix="/user")
    app.register_blueprint(history_bp, url_prefix="")  