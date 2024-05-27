import flaskr.routes
from flaskr.routes import project


def configureRoutes(app):
    with app.app_context():

        app.register_blueprint(flaskr.routes.index_bp)
        app.register_blueprint(project.project_bp)
