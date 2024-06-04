from flask import request, Blueprint
from flaskr.models import db, User
from flaskr.utils import sendJsonResponse, jsonRequired
import uuid

shallowDelete_bp = Blueprint("shallowDelete", __name__)


# Delete user data ONLY from the auth db. This is not an application wide user deletion
@shallowDelete_bp.route("/shallowdelete", methods=["DELETE"])
@jsonRequired
def shallowDelete():

    data = request.get_json()

    # Convert to UUID object, but catch error if request uuid is invalid format
    try:
        user_uuid = uuid.UUID(data.get("uuid"))
    except Exception:
        return sendJsonResponse(400, "Invalid UUID")

    # Lookup user by UUID
    user = db.session.query(User).filter_by(uuid=user_uuid).first()

    # If there is a match, delete the db entry
    if user:
        try:
            db.session.delete(user)
            db.session.commit()
            # Successful deletion of user, send OK response
            return sendJsonResponse(200, user.uuid)

        except Exception as e:
            # If there is a DB error, rollback and forward the error in response
            db.session.rollback()
            return sendJsonResponse(500, "Error from auth DB", e)

    # DB query returned no results for valid UUID
    return sendJsonResponse(400, "UUID not found")
