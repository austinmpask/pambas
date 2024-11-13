from flask import Blueprint, request

from flaskr.config import DataFields
from flaskr.models import db
from flaskr.utils import (
    jsonRequired,
    queryForUserByUUID,
    sendJsonResponse,
    uuidRequired,
)
from flaskr.validators import Validators

userdataBP = Blueprint("userdata", __name__)


# Get and user data by UUID
@userdataBP.route("/userdata", methods=["GET"])
@uuidRequired
def getUserData(userUUID):
    # Find the user in user DB, errors handled by helper function
    status, body = queryForUserByUUID(userUUID)

    # Convert user information if there wasnt an error
    if status == 200:
        body = body.toSafeDict()

    # Respond with status and user info or error
    return sendJsonResponse(status, body)


# Modify user infromation in the user database (first/last name etc.)
@userdataBP.route("/userdata", methods=["PUT"])
@jsonRequired
@uuidRequired
def putUserData(userUUID):
    # Find the user in user DB
    status, user = queryForUserByUUID(userUUID)

    # Abort if lookup error
    if status != 200:
        return sendJsonResponse(status, user)

    # Parse request body
    reqBody = request.get_json()

    # Attempt to update record
    try:
        user.first_name = Validators.firstName(reqBody.get("first_name"))
        user.last_name = Validators.lastName(reqBody.get("last_name"))

        # Settings
        # user.defaultManagerName = Validators.managerName(
        #     reqBody.get("default_manager_name")
        # )

        # Bool
        user.tooltips = Validators.boolSetting(reqBody.get("tooltips"))
        # user.useDefaultManager = Validators.boolSetting(
        #     reqBody.get("use_default_manager")
        # )
        user.completeProgress = Validators.boolSetting(reqBody.get("complete_progress"))
        user.highContrast = Validators.boolSetting(reqBody.get("high_contrast"))

        # Int

        user.rowHeightPreset = Validators.preset(
            reqBody.get("row_height_preset"), DataFields.PRESET_ROW_HEIGHT_MAX
        )
        user.rowExpandedPreset = Validators.preset(
            reqBody.get("row_expanded_preset"), DataFields.PRESET_ROW_EXPANDED_MAX
        )
        user.defaultProjectType = Validators.preset(
            reqBody.get("default_project_type"), DataFields.PRESET_DEFAULT_PROJ_MAX
        )
        user.defaultProjectTheme = Validators.preset(
            reqBody.get("default_project_theme"), DataFields.PRESET_DEFAULT_THEME_MAX
        )
        user.tooltipDelay = Validators.preset(
            reqBody.get("tooltip_delay"), DataFields.PRESET_TOOLTIP_MAX
        )

        db.session.commit()

        # Successful update, respond with user info
        return sendJsonResponse(200, user.toSafeDict())

    # Catch validation errors
    except (ValueError, TypeError) as e:
        db.session.rollback()
        return sendJsonResponse(400, str(e))
    # Catch all
    except Exception as e:
        db.session.rollback()
        return sendJsonResponse(500, f"User database error while editing User: {e}")
