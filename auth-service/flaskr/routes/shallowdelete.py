from flask import request, Blueprint
from flask_bcrypt import Bcrypt
from flaskr.models import db, User
from flaskr.util import sendJsonResponse
import uuid

shallowDelete_bp = Blueprint("shallowDelete", __name__)


@shallowDelete_bp.route("/shallowdelete", methods=["DELETE"])
def shallowDelete():
    invalidJSONResponse = sendJsonResponse(400, "Must be JSON request")

    # Only accept application/json requests
    if request.is_json:
        data = request.get_json()

        # Convert to UUID object, but catch error if request uuid is invalid format
        try:
            user_uuid = uuid.UUID(data.get("uuid"))
        except Exception:
            return sendJsonResponse(400, "Invalid UUID")

        # Lookup user by UUID and delete
        user = db.session.query(User).filter_by(uuid=user_uuid).first()

        if user:
            try:
                # Successful deletion of user, send OK response
                db.session.delete(user)
                db.session.commit()
                return sendJsonResponse(200, user.uuid)

            except Exception as e:
                # If there is a DB error, rollback and forward the error in response
                db.session.rollback()
                return sendJsonResponse(400, "Error from auth DB", e)

        else:
            # DB query returned no results for valid UUID
            return sendJsonResponse(400, "UUID not found")

    else:
        # Non JSON body request rec.
        return invalidJSONResponse
