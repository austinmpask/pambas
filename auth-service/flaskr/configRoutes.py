from flaskr.routes import registerBP, loginBP, shallowDeleteBP, indexBP


def configureRoutes(app):

    with app.app_context():

        # Register blueprints for API endpoints
        app.register_blueprint(indexBP)
        app.register_blueprint(registerBP)
        app.register_blueprint(loginBP)
        app.register_blueprint(shallowDeleteBP)
