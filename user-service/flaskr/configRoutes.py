from flaskr.routes import registerBP, userdataBP, indexBP


def configureRoutes(app):
    with app.app_context():

        # Register blueprints for API endpoints
        app.register_blueprint(indexBP)
        app.register_blueprint(registerBP)
        app.register_blueprint(userdataBP)
