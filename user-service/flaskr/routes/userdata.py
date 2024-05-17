from flask import jsonify, request, Blueprint
from flaskr.models import db, User
from flaskr.util import sendJsonResponse
import uuid

userdata_bp = Blueprint("userdata", __name__)


# Get and update user data by UUID in JSON request body
@userdata_bp.route("/userdata", methods=["GET", "PUT"])
def userData():

    # Request must have JSON body
    if request.is_json:

        # Parse request
        data = request.get_json()

        # Check if UUID is valid
        try:
            user_uuid = data["uuid"]
            user_uuid = uuid.UUID(user_uuid)
        except Exception as e:
            return sendJsonResponse(400, "Missing UUID", e)

        # Find the user in user DB
        user = db.session.query(User).filter_by(uuid=user_uuid).first()

        if not user:
            return sendJsonResponse(404, "User not found")

        # Update user data
        if request.method == "PUT":

            # Exit if no data is provided with UUID
            if len(data.keys()) < 2:
                return sendJsonResponse(400, "Missing attributes")

            # Gather data from request, use existing data as default to dynamically handle multiple replacements
            firstName = data.get("first_name", user.firstName)
            lastName = data.get("last_name", user.lastName)

            # Update the record
            try:
                user.firstName = firstName
                user.lastName = lastName
                db.session.commit()
            except Exception as e:
                db.session.rollback()
                return sendJsonResponse(400, "User DB error")

        # Respond with the user info
        return sendJsonResponse(200, user.toDict())

    return sendJsonResponse(400, "Must be JSON request")
