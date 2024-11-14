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

    # Settings
    PRESET_TYPE = int

    PRESET_MIN = 0

    PRESET_ROW_HEIGHT_MAX = 2
    PRESET_ROW_EXPANDED_MAX = 2
    PRESET_DEFAULT_PROJ_MAX = 3
    PRESET_DEFAULT_THEME_MAX = 5
    PRESET_TOOLTIP_MAX = 4

    MANAGER_NAME_MIN = 2
    MANAGER_NAME_MAX = 50
