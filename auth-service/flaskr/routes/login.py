from flask import request, make_response, Blueprint, current_app
from flaskr.config import bcrypt
from flaskr.utils import sendJsonResponse, queryForUser, jsonRequired
import jwt

login_bp = Blueprint("login", __name__)


@login_bp.route("/login", methods=["POST"])
@jsonRequired
def login():
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
        return sendJsonResponse(500, "Auth DB query error", e)

    # User exists in the DB, check passwords
    if user:
        if bcrypt.check_password_hash(user.password_hash, password):

            # User matched, generate JWT with UUID payload
            sessionJWT = jwt.encode(
                {"uuid": str(user.uuid)},
                current_app.config["SECRET_KEY"],
                algorithm="HS256",
            )

            # Send response with JWT added as http only cookie
            response = make_response(sendJsonResponse(200, "Successful login"))

            response.set_cookie(
                "token", sessionJWT, httponly=True, secure=True, samesite="None"
            )
            return response

    # Catch no matching user by credential/incorrect password
    return sendJsonResponse(401, "Unauthorized: Incorrect login")
