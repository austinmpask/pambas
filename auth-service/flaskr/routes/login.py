from flask import request, make_response, Blueprint, current_app
from flaskr.config import bcrypt
from flaskr.utils import (
    sendJsonResponse,
    queryForUser,
    jsonRequired,
    uuidRequired,
    queryForUserByUUID,
)
import jwt
from flaskr.validators import Validators
import os

loginBP = Blueprint("login", __name__)


# Return the email and username for a UUID provided in the req. header
@loginBP.route("/login", methods=["GET"])
@uuidRequired
def getLogin(userUUID):

    # Find the user in user db
    status, body = queryForUserByUUID(userUUID)

    # Convert user info if there isnt error
    if status == 200:
        body = body.toSafeDict()

    # Respond with the user info or error
    return sendJsonResponse(status, body)


# Accepts a credential, which can be an email or username, and plaintext password
@loginBP.route("/login", methods=["POST"])
@jsonRequired
def postLogin():
    # Parse request body
    reqBody = request.get_json()

    try:
        credential = Validators.credential(reqBody.get("credential"))
        password = Validators.plainPassword(reqBody.get("password"))

    # Catch validation errors
    except (ValueError, TypeError) as e:
        return sendJsonResponse(400, str(e))

    # Catch all
    except Exception as e:
        return sendJsonResponse(500, f"Could not process credential/password: {str(e)}")

    print(credential)
    # Query DB for a matching user
    status, body = queryForUser(credential)

    print(status)

    # Abort if error or user not found
    if status != 200:
        sendJsonResponse(status, body or "User not found")

    # User exists in the DB, check passwords
    if bcrypt.check_password_hash(body.password_hash, password):

        # User matched, generate JWT with UUID payload
        sessionJWT = jwt.encode(
            {"uuid": str(body.uuid)},
            current_app.config["SECRET_KEY"],
            algorithm="HS256",
        )

        # Send response with JWT added as http only cookie
        response = make_response(sendJsonResponse(200, "Successful login"))

        # Configure JWT for dev vs prod
        sameSiteType = "None"
        if os.environ.get("FLASK_ENV") == "development":
            sameSiteType = "Lax"

        response.set_cookie(
            "token", sessionJWT, httponly=True, secure=(os.environ.get("FLASK_ENV") != "development"), samesite=sameSiteType
        )
        return response

    # Incorrect password, unauthorized
    return sendJsonResponse(401, "Unauthorized")
