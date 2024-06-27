import flaskr.routes
from flaskr.routes import project, lineitem, openitem


def configureRoutes(app):
    with app.app_context():

        # Register blueprints for API endpoints
        app.register_blueprint(flaskr.routes.index_bp)
        app.register_blueprint(project.project_bp)
        app.register_blueprint(lineitem.lineitem_bp)
        app.register_blueprint(openitem.openItemBp)
