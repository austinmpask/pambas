from flask import request, Blueprint
from flaskr.models import db, User
from flaskr.utils import sendJsonResponse, jsonRequired, uuidRequired
from flaskr.validators import Validators

registerBP = Blueprint("register", __name__)


# Register a new user in user DB
@registerBP.route("/register", methods=["POST"])
@jsonRequired
@uuidRequired
def registerUser(userUUID):

    # Parse the request body
    reqBody = request.get_json()

    # Try to create user in the user DB and commit
    try:
        # Ensure validations pass
        firstName = Validators.firstName(reqBody.get("first_name"))
        lastName = Validators.lastName(reqBody.get("last_name"))

        newUser = User(uuid=userUUID, first_name=firstName, last_name=lastName)

        db.session.add(newUser)
        db.session.commit()

        # Successfully registered user, return the UUID to gateway
        return sendJsonResponse(201, newUser.uuid)

    # Catch validation errors
    except (ValueError, TypeError) as e:
        db.session.rollback()
        return sendJsonResponse(400, str(e))
    # Catch all
    except Exception as e:
        db.session.rollback()
        return sendJsonResponse(500, f"User Database error while registering User: {e}")
