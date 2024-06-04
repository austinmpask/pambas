import os
from flask_bcrypt import Bcrypt


# Resolve constants for flask app
class Configuration:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SECRET_KEY = os.environ.get("SECRET_KEY") or "secret"


# Init bcrypt for use in app factory
bcrypt = Bcrypt()
