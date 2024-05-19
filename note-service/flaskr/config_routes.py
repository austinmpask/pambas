import flaskr.routes


def configureRoutes(app):
    with app.app_context():

        app.register_blueprint(flaskr.routes.index_bp)
