from flask import Blueprint
from flaskr.models import db
from flaskr.utils import (
    sendJsonResponse,
    jsonRequired,
    uuidRequired,
    queryForUserByUUID,
)

shallowDeleteBP = Blueprint("shallowDelete", __name__)


# Delete user data ONLY from the auth db. This is not an application wide user deletion.
# Used if there is a registration error between services
@shallowDeleteBP.route("/shallowdelete", methods=["DELETE"])
@jsonRequired
@uuidRequired
def shallowDelete(userUUID):

    # Lookup user by UUID
    status, body = queryForUserByUUID(userUUID)

    # Abort if error or user not found
    if status != 200:
        return sendJsonResponse(status, body or "User not found")

    # If there is a match attempt to delete the db entry
    try:
        db.session.delete(body)
        db.session.commit()

        # Successful deletion of user, send OK response
        return sendJsonResponse(200, userUUID)

    except Exception as e:
        # If there is a DB error, rollback and forward the error in response
        db.session.rollback()
        return sendJsonResponse(
            500, f"Auth database error while deleting User: {str(e)}"
        )
