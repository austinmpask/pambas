from flask import Flask
from flask_migrate import Migrate
from .config import Configuration
from .models import db


# App factory
def createApp():
    app = Flask(__name__)
    app.config.from_object(Configuration)

    configureRoutes(app)

    # Init DB
    db.init_app(app)
    Migrate(app, db)
    return app


def configureRoutes(app):
    @app.route("/")
    def index():
        return "rootrouteauth"

    @app.route("/test")
    def test():
        return "testrouteauth"
