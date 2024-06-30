from flaskr.routes import projectBP, lineItemBP, openItemBP, indexBP


def configureRoutes(app):
    with app.app_context():

        # Register blueprints for API endpoints
        app.register_blueprint(indexBP)
        app.register_blueprint(projectBP)
        app.register_blueprint(lineItemBP)
        app.register_blueprint(openItemBP)
