from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from .config import Configuration
from .routes import configureRoutes
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
