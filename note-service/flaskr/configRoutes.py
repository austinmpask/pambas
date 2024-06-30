from flaskr.routes import project, lineItem, openItem, indexBP


def configureRoutes(app):
    with app.app_context():

        # Register blueprints for API endpoints
        app.register_blueprint(indexBP)
        app.register_blueprint(project.projectBP)
        app.register_blueprint(lineItem.lineItemBP)
        app.register_blueprint(openItem.openItemBP)
