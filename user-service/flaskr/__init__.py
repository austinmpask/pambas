from flask import Flask
from flask_migrate import Migrate
from .config import Configuration
from .models import db


# App factory
def createApp(testing=False):
    app = Flask(__name__)
    app.config.from_object(Configuration)

    if testing:
        app.config["TESTING"] = True
        # TO IMPLEMENT SEPARATE DB

    # Init DB
    db.init_app(app)
    Migrate(app, db)
    return app
