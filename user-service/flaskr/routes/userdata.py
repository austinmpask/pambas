from flask import request, Blueprint
from flaskr.models import db, User
from flaskr.utils import sendJsonResponse, jsonRequired, queryForUserByUUID
import uuid

userdata_bp = Blueprint("userdata", __name__)


# Get and update user data by UUID in JSON request body
@userdata_bp.route("/userdata", methods=["GET"])
def getUserData():

    # Check if UUID is valid
    try:
        user_uuid = uuid.UUID(request.headers.get("UUID"))
    except Exception as e:
        return sendJsonResponse(400, "Invalid UUID", e)

    # Find the user in user DB, errors handled by helper function
    user = queryForUserByUUID(user_uuid)

    # Send error response if unsuccessful
    if not isinstance(user, User):
        return sendJsonResponse(*user)

    # Respond with the user info if user found
    return sendJsonResponse(200, user.toSafeDict())


# Modify user infromation in the user database (first/last name etc.)
@userdata_bp.route("/userdata", methods=["PUT"])
@jsonRequired
def putUserData():

    # Parse request
    data = request.get_json()

    # Check if UUID is valid
    try:
        user_uuid = uuid.UUID(data.get("uuid"))
    except Exception as e:
        return sendJsonResponse(400, "Invalid UUID", e)

    # Exit if no data is provided with UUID
    if len(data.keys()) < 2:
        return sendJsonResponse(400, "Missing attributes")

    # Find the user in user DB
    user = queryForUserByUUID(user_uuid)

    # Send error response if unsuccessful
    if not isinstance(user, User):
        return sendJsonResponse(*user)

    # Gather data from request, use existing data as default to dynamically handle multiple replacements
    firstName = data.get("first_name") or user.firstName
    lastName = data.get("last_name") or user.lastName

    # Update the record
    try:
        user.firstName = firstName
        user.lastName = lastName
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return sendJsonResponse(400, "User DB error", e)

    # Respond with the user info
    return sendJsonResponse(200, user.toSafeDict())
