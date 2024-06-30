from flaskr.routes import register, userdata, indexBP


def configureRoutes(app):
    with app.app_context():

        # Register blueprints for API endpoints
        app.register_blueprint(indexBP)
        app.register_blueprint(register.registerBP)
        app.register_blueprint(userdata.userdataBP)
