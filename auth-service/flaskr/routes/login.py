from flask import request, make_response, Blueprint, current_app
from flaskr.config import bcrypt
from flaskr.models import db, User
from flaskr.util import sendJsonResponse, queryForUser
import validators
import jwt


login_bp = Blueprint("login", __name__)


@login_bp.route("/login", methods=["POST"])
def login():

    # Must be application/JSON
    if request.is_json:

        # Parse request body
        data = request.get_json()

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        # Exit operation if neither username nor email is provided
        if not (email or username):
            return sendJsonResponse(400, "Login credential missing")

        # Exit operation if a password is not provided
        if not password:
            return sendJsonResponse(400, "Password missing")

        # Query DB for a matching user, will use email by default, or username if no email
        try:
            user = queryForUser(email=email, username=username)
        except Exception as e:
            # Catch if there is an error querying the DB
            return sendJsonResponse(400, "Auth DB query error", e)

        # User exists in the DB, check passwords
        if user:
            if bcrypt.check_password_hash(user.password_hash, password):

                # User matched, generate JWT
                sessionJWT = jwt.encode(
                    {"uuid": str(user.uuid)},
                    current_app.config["SECRET_KEY"],
                    algorithm="HS256",
                )

                response = make_response(sendJsonResponse(200, sessionJWT))

                response.set_cookie(
                    "token", sessionJWT, httponly=True, secure=True, samesite="None"
                )
                return response

        return sendJsonResponse(401, "Unauthorized: Incorrect login")

    # Non JSON request
    return sendJsonResponse(400, "Must be JSON request")
