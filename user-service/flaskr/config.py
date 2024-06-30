import os
import uuid


# Resolve constants for flask app
class Configuration:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")


# Specify data field lengths to be used by orm and validators
class DataFields:

    UUID_TYPE = uuid.UUID

    FIRST_NAME_MIN_LENGTH = 2
    FIRST_NAME_MAX_LENGTH = 25

    LAST_NAME_MIN_LENGTH = 2
    LAST_NAME_MAX_LENGTH = 25

    NAME_TYPE = str
