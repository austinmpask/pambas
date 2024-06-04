from flask import Flask
from flask_migrate import Migrate
from .config import Configuration, bcrypt
from .config_routes import configureRoutes
from .models import db


# App factory
def createApp():
    app = Flask(__name__)
    app.config.from_object(Configuration)

    # Add endpoints to flask app
    configureRoutes(app)

    # Init bcrypt for pw hash
    bcrypt.init_app(app)

    # Init db
    db.init_app(app)
    Migrate(app, db)
    return app
