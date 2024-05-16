import os
from flask_bcrypt import Bcrypt


class Configuration:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")


bcrypt = Bcrypt()
