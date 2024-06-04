from flask import request, Blueprint
from flaskr.models import db, User
from flaskr.utils import sendJsonResponse, queryForUserByUUID
import uuid

getlogin_bp = Blueprint("getlogin", __name__)


# Return the email and username for a UUID provided in the req. header
@getlogin_bp.route("/getlogin", methods=["GET"])
def getLogin():

    # Check if UUID is valid
    try:
        user_uuid = uuid.UUID(request.headers.get("UUID"))
    except Exception as e:
        return sendJsonResponse(400, "Invalid UUID", e)

    # Find the user in user db
    user = queryForUserByUUID(user_uuid)

    # Handle errors from helper function
    if not isinstance(user, User):
        return sendJsonResponse(*user)

    # Respond with the user info if UUID yields user
    return sendJsonResponse(200, user.toSafeDict())
