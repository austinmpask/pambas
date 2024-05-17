from flaskr.routes import register, shallowdelete, login
import flaskr.routes


def configureRoutes(app):

    with app.app_context():

        # Register blueprints for API endpoints
        app.register_blueprint(flaskr.routes.index_bp)
        app.register_blueprint(register.register_bp)
        app.register_blueprint(login.login_bp)
        app.register_blueprint(shallowdelete.shallowDelete_bp)
