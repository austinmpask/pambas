from flask import request, Blueprint
from flaskr.models import db, User
from flaskr.utils import sendJsonResponse
import uuid

getlogin_bp = Blueprint("getlogin", __name__)


# Return the email and username for a UUID provided in the req. header
@getlogin_bp.route("/getlogin", methods=["GET"])
def getLogin():

    # Check if UUID is valid
    try:
        user_uuid = request.headers.get("UUID")
        user_uuid = uuid.UUID(user_uuid)
    except Exception as e:
        return sendJsonResponse(400, "Invalid UUID", e)

    # Find the user in user db
    user = db.session.query(User).filter_by(uuid=user_uuid).first()

    # If UUID yields no results
    if not user:
        return sendJsonResponse(404, "User not found")

    # Respond with the user info if UUID yields user
    return sendJsonResponse(200, user.toSafeDict())
