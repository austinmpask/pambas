from flask import request, Blueprint
from flaskr.models import db, User
from flaskr.utils import sendJsonResponse, jsonRequired, queryForUserByUUID
import uuid

shallowDeleteBP = Blueprint("shallowDelete", __name__)


# Delete user data ONLY from the auth db. This is not an application wide user deletion
@shallowDeleteBP.route("/shallowdelete", methods=["DELETE"])
@jsonRequired
def shallowDelete():

    data = request.get_json()

    # Convert to UUID object, but catch error if request uuid is invalid format
    try:
        user_uuid = uuid.UUID(data.get("uuid"))
    except Exception:
        return sendJsonResponse(400, "Invalid UUID")

    # Lookup user by UUID
    user = queryForUserByUUID(user_uuid)

    # Handle errors from helper function
    if not isinstance(user, User):
        return sendJsonResponse(*user)
    # If there is a match, delete the db entry
    try:
        db.session.delete(user)
        db.session.commit()
        # Successful deletion of user, send OK response
        return sendJsonResponse(200, user.uuid)

    except Exception as e:
        # If there is a DB error, rollback and forward the error in response
        db.session.rollback()
        return sendJsonResponse(500, "Error from auth DB", e)
