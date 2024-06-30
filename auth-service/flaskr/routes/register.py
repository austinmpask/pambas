from flask import request, Blueprint
from flaskr.config import bcrypt
from flaskr.models import db, User
from flaskr.utils import sendJsonResponse, jsonRequired
from flaskr.validators import Validators

registerBP = Blueprint("register", __name__)


# Register a new user in auth DB
@registerBP.route("/register", methods=["POST"])
@jsonRequired
def register():
    # Parse the request body
    data = request.get_json()

    # Attempt to register the user in DB
    try:
        username = Validators.userName(data.get("username"))
        email = Validators.email(data.get("email"))
        password = Validators.plainPassword(data.get("password"))

        # Generate password hash from plaintext
        passwordHash = bcrypt.generate_password_hash(password).decode("utf-8")

        # Save the user to DB
        newUser = User(user_name=username, email=email, password_hash=passwordHash)

        db.session.add(newUser)
        db.session.commit()

        # Success, return UUID to gateway
        return sendJsonResponse(201, newUser.uuid)

    # Catch validation errors
    except (ValueError, TypeError) as e:
        db.session.rollback()
        return sendJsonResponse(400, str(e))

    # Catch all
    except Exception as e:
        db.session.rollback()
        return sendJsonResponse(
            500, f"Auth database error while registering User: {str(e)}"
        )
