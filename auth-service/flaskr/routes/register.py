from flask import request, Blueprint
from flaskr.config import bcrypt
from flaskr.models import db, User
from flaskr.utils import sendJsonResponse, jsonRequired

register_bp = Blueprint("register", __name__)


# Register a new user in auth DB
@register_bp.route("/register", methods=["POST"])
@jsonRequired
def register():
    # Parse the request body
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    """TODO: Add min length password requirement"""

    # Validate that all three items are present and are not empty strings
    if username and email and password:

        # Hash password for storage
        passwordHash = bcrypt.generate_password_hash(password).decode("utf-8")

        # Create user in the auth DB and commit
        # Ensure that constraints and validators are passed
        try:
            newUser = User(user_name=username, email=email, password_hash=passwordHash)

            db.session.add(newUser)
            db.session.commit()

            # Successfully registered user, return the UUID back to gateway
            return sendJsonResponse(201, newUser.uuid)

        # Catch model validator errors
        except ValueError as e:
            db.session.rollback()
            return sendJsonResponse(400, "ValueError from auth DB", e)
        # Catch-all
        except Exception as e:
            db.session.rollback()
            return sendJsonResponse(500, "Error from auth DB", e)

    # One or more of the request fields was None/empty
    return sendJsonResponse(400, "Missing username/email/password")
