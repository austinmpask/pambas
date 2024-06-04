from flask import request, Blueprint
from flaskr.models import db, User
from flaskr.utils import sendJsonResponse, jsonRequired
import uuid

register_bp = Blueprint("register", __name__)


# Register a new user in user DB
@register_bp.route("/register", methods=["POST"])
@jsonRequired
def register():

    # Parse the request body
    data = request.get_json()
    firstName = data.get("first_name")
    lastName = data.get("last_name")

    # Catch error if UUID is none or "" or otherwise invalid
    try:
        user_uuid = uuid.UUID(data.get("uuid"))
    except Exception as e:
        # UUID missing/invalid
        return sendJsonResponse(400, "Invalid UUID", e)

    # Validate that other items are present and not empty
    if firstName and lastName:
        # Make first/last name title case
        firstName = firstName.title()
        lastName = lastName.title()

        # Create user in the user DB and commit
        # Ensure that constraints and validators are passed
        try:
            newUser = User(uuid=user_uuid, firstName=firstName, lastName=lastName)
            db.session.add(newUser)
            db.session.commit()

            # Successfully registered user, return the UUID for use in User service
            return sendJsonResponse(201, newUser.uuid)

        # Catch errors from model constraints
        except Exception as e:
            db.session.rollback()
            return sendJsonResponse(400, "User DB Error", e)

    # One or more of the request fields was None/empty
    return sendJsonResponse(400, "Missing firstname/lastname")
