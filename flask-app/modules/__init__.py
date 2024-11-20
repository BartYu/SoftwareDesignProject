# Import modules / classes here
def register_routes(app, mysql):
    from .Login import login_bp
    from .Profile import profile_bp
    from .History import history_bp  
    from .Management import management_bp
    from .Matching import matching_bp
    from .Calendar import calendar_bp
    from .Notification import notification_bp
    from .Report import report_bp
    
    login_bp.mysql = mysql
    profile_bp.mysql = mysql
    history_bp.mysql = mysql
    management_bp.mysql = mysql
    matching_bp.mysql = mysql
    calendar_bp.mysql = mysql
    notification_bp.mysql = mysql
    report_bp.mysql = mysql

    app.register_blueprint(login_bp, url_prefix='/auth')
    app.register_blueprint(profile_bp, url_prefix="/user")
    app.register_blueprint(history_bp, url_prefix="")  
    app.register_blueprint(management_bp, url_prefix="/event")
    app.register_blueprint(matching_bp, url_prefix='/macho')
    app.register_blueprint(calendar_bp, url_prefix='/calendar')
    app.register_blueprint(notification_bp, url_prefix='/notification')
    app.register_blueprint(report_bp, url_prefix='/report')

