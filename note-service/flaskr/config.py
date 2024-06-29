import os
import uuid
from datetime import datetime


# Resolve constants for flask app
class Configuration:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")


# Specify data field lengths to be used by orm and validators
class DataFields:
    # Project

    UUID_TYPE = uuid.UUID

    PROJECT_TITLE_MIN_LENGTH = 2
    PROJECT_TITLE_MAX_LENGTH = 30
    PROJECT_TITLE_TYPE = str

    BUDGET_MIN = 0
    BUDGET_MAX = 200
    BUDGET_TYPE = float
    BUDGET_INCREMENTAL = 0.25

    BILLED_MIN = 0.25
    BILLED_MAX = 200
    BILLED_TYPE = float
    BILLED_INCREMENTAL = 0.25

    FULL_NAME_MIN_LENGTH = 2
    FULL_NAME_MAX_LENGTH = 50
    FULL_NAME_TYPE = str

    PROJECT_TYPE_MIN_LENGTH = 2
    PROJECT_TYPE_MAX_LENGTH = 15
    PROJECT_TYPE_TYPE = str

    PROJECT_TYPES = {
        "SOC 1 Type 1",
        "SOC 1 Type 2",
        "SOC 2 Type 1",
        "SOC 2 Type 2",
        "Other",
    }

    HEADER_MIN_LENGTH = 0
    HEADER_MAX_LENGTH = 15
    HEADER_TYPE = str

    # Section
    SECTION_NUM_MIN = 1
    SECTION_NUM_MAX = 99
    SECTION_NUM_TYPE = int

    # LineItem
    CONTROL_NUM_MIN_LENGTH = 4
    CONTROL_NUM_MAX_LENGTH = 5
    CONTROL_NUM_TYPE = str

    FLAG_TYPE = bool

    CHECKBOX_VAL_MIN = 0
    CHECKBOX_VAL_MAX = 2
    CHECKBOX_VAL_TYPE = int

    NOTES_MIN_LENGTH = 0
    NOTES_MAX_LENGTH = 2000
    NOTES_TYPE = str

    NUM_CHECKBOX = 3
    CHECKBOX_TYPE = list

    # PendingItem
    PENDING_ITEM_NAME_MIN_LENGTH = 2
    PENDING_ITEM_NAME_MAX_LENGTH = 40
    PENDING_ITEM_NAME_TYPE = str

    PENDING_ITEM_DESC_MIN_LENGTH = 0
    PENDING_ITEM_DESC_MAX_LENGTH = 200
    PENDING_ITEM_DESC_TYPE = str

    CONTACT_DATE_TYPE = datetime
