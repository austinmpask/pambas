from flask import Flask
from flask_migrate import Migrate
from .config import Configuration, bcrypt
from .config_routes import configureRoutes
from .models import db


# App factory
def createApp():
    app = Flask(__name__)
    app.config.from_object(Configuration)

    configureRoutes(app)
    bcrypt.init_app(app)

    # Init DB
    db.init_app(app)
    Migrate(app, db)
    return app
