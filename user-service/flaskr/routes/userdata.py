from flask import request, Blueprint
from flaskr.models import db
from flaskr.utils import (
    sendJsonResponse,
    jsonRequired,
    uuidRequired,
    queryForUserByUUID,
)
from flaskr.validators import Validators

userdataBP = Blueprint("userdata", __name__)


# Get and user data by UUID
@userdataBP.route("/userdata", methods=["GET"])
@uuidRequired(True)
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
@uuidRequired(False)
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
