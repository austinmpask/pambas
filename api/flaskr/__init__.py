from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import Configuration
from .models import db, Domain
from .blueprints.test import test_bp


# App factory
def createApp(testing=False):
    app = Flask(__name__)
    app.config.from_object(Configuration)

    if testing:
        app.config["TESTING"] = True
        # TO IMPLEMENT SEPARATE DB

    # Blueprints
    app.register_blueprint(test_bp)

    # Init DB
    db.init_app(app)
    Migrate(app, db)
    return app
