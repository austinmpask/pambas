import os
import uuid
from flask_bcrypt import Bcrypt


# Resolve constants for flask app
class Configuration:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SECRET_KEY = os.environ.get("SECRET_KEY") or "secret"


# Init bcrypt for use in app factory
bcrypt = Bcrypt()


# Min and max lengths/types for validators
class DataFields:

    UUID_TYPE = uuid.UUID

    USER_NAME_MIN_LEN = 3
    USER_NAME_MAX_LEN = 20
    USER_NAME_TYPE = str

    EMAIL_MIN_LEN = 5
    EMAIL_MAX_LEN = 64
    EMAIL_TYPE = str

    PW_HASH_LEN = 60
    PW_HASH_TYPE = str

    PW_PLAIN_MIN_LEN = 8
    PW_PLAIN_MAX_LEN = 64
    PW_PLAIN_TYPE = str
