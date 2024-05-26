from flask import jsonify, request, Blueprint
from flaskr.models import db, User
from flaskr.util import sendJsonResponse
import uuid

getlogin_bp = Blueprint("getlogin", __name__)


@getlogin_bp.route("/getlogin", methods=["GET"])
def getLogin():

    # Check if UUID is valid
    try:
        user_uuid = request.headers.get("UUID")
        user_uuid = uuid.UUID(user_uuid)
    except Exception as e:
        return sendJsonResponse(400, "Missing UUID", e)

    # Find the user in user DB
    user = db.session.query(User).filter_by(uuid=user_uuid).first()

    if not user:
        return sendJsonResponse(404, "User not found")

    # Respond with the user info
    return sendJsonResponse(200, user.toSafeDict())
