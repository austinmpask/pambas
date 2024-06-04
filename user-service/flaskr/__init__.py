from flask import Flask
from flask_migrate import Migrate
from .config import Configuration
from .models import db
from .config_routes import configureRoutes


# App factory
def createApp():
    app = Flask(__name__)
    app.config.from_object(Configuration)

    # Add endpoints to flask app
    configureRoutes(app)

    # Init DB
    db.init_app(app)
    Migrate(app, db)
    return app
