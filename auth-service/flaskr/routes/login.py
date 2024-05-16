from flask import request, Blueprint
from flaskr.config import bcrypt
from flaskr.models import db
from flaskr.util import sendJsonResponse
import validators


login_bp = Blueprint("login", __name__)


@login_bp.route("/login", methods=["POST"])
def login():
    invalidJSONResponse = sendJsonResponse(400, "Must be JSON request")

    if request.is_json:

        # Parse request body
        data = request.get_json()

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        # Exit operation if a password is not provided
        if password:
            # Atleast one credential must be provided. Email is the default identifier
            if email and validators.email(email):
                # Email was provided in request and is valid format
                try:
                    user = db.session.query(User).filter_by(email=email).first()
                except Exception as e:
                    # Catch if there is an error querying the DB
                    return sendJsonResponse(400, "Error from auth DB: ", e)

                # User exists in the DB, check passwords
                if user:
                    if bcrypt.checkpw(
                        password=password, hashed_password=user.password_hash
                    ):
                        # Successful authentication with email
                        return sendJsonResponse(200, "JWT TOKEN HERE")
                    else:
                        # Password mismatch
                        return sendJsonResponse(401, "Unauthorized: Incorrect login")

                else:
                    return sendJsonResponse(401, "Unauthorized: Incorrect login")

            elif username:
                # Query with username instead of email
                try:
                    user = db.session.query(User).filter_by(user_name=username).first
                except Exception as e:
                    # Catch if there is an error querying the DB
                    return sendJsonResponse(400, "Error from auth DB: ", e)

                # User exists in the DB, check passwords
                if user:
                    if bcrypt.checkpw(
                        password=password, hashed_password=user.password_hash
                    ):
                        # Successful authentication with email
                        return sendJsonResponse(200, "JWT TOKEN HERE")
                    else:
                        # Password mismatch
                        return sendJsonResponse(401, "Unauthorized: Incorrect login")

                else:
                    return sendJsonResponse(401, "Unauthorized: Incorrect login")

            else:
                return sendJsonResponse(400, "Login credential missing")

        else:
            # Password not included in request or is ""
            return sendJsonResponse(400, "Password missing")

    else:
        return invalidJSONResponse
