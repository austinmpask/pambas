import os


# Resolve constants for flask app
class Configuration:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
