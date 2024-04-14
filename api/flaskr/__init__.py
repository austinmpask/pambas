from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import Configuration
from .models import db, Domain
from .blueprints.test import test_bp

# Config flask


def createApp():
    app = Flask(__name__)
    app.config.from_object(Configuration)

    # Blueprints
    app.register_blueprint(test_bp)

    # Init DB
    db.init_app(app)
    Migrate(app, db)
    return app
