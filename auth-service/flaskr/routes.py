from flask import jsonify, request, make_response
from flask_bcrypt import Bcrypt
from .models import db, User
from .util import sendJsonResponse
import uuid


def configureRoutes(app):

    # Standard response for non JSON request for use across routes
    invalidJSONResponse = sendJsonResponse(app, 400, "Must be JSON request")

    bcrypt = Bcrypt(app)

    with app.app_context():

        # Test route for gateway
        @app.route("/", methods=["GET"])
        def index():
            return sendJsonResponse(app, 200, "ok from auth service")

        @app.route("/shallowdelete", methods=["DELETE"])
        def shallowDelete():
            # Only accept application/json requests
            if request.is_json:
                data = request.get_json()

                # Convert to UUID object, but catch error if request uuid is invalid format
                try:
                    user_uuid = uuid.UUID(data.get("uuid"))
                except Exception:
                    return sendJsonResponse(app, 400, "Invalid UUID")

                # Lookup user by UUID and delete
                user = db.session.query(User).filter_by(uuid=user_uuid).first()

                if user:
                    try:
                        # Successful deletion of user, send OK response
                        db.session.delete(user)
                        db.session.commit()
                        return sendJsonResponse(app, 200, user.uuid)

                    except Exception as e:
                        # If there is a DB error, rollback and forward the error in response
                        db.session.rollback()
                        return sendJsonResponse(app, 400, "Error from auth DB", e)

                else:
                    # DB query returned no results for valid UUID
                    return sendJsonResponse(app, 400, "UUID not found")

            else:
                # Non JSON body request rec.
                return invalidJSONResponse

        # Register a new user in auth DB
        @app.route("/register", methods=["POST"])
        def register():
            if request.is_json:

                # Parse the request body
                data = request.get_json()

                username = data.get("username")
                email = data.get("email")
                password = data.get("password")

                # Validate that all three items are present and are not empty strings
                if username and email and password:

                    # Hash password for storage
                    passwordHash = bcrypt.generate_password_hash(password).decode(
                        "utf-8"
                    )

                    # Create user in the auth DB and commit
                    # Ensure that constraints and validators are passed
                    try:
                        newUser = User(
                            user_name=username, email=email, password_hash=passwordHash
                        )

                        db.session.add(newUser)
                        db.session.commit()

                        # Successfully registered user, return the UUID for use in User service
                        return sendJsonResponse(app, 201, newUser.uuid)

                    # Catch model validator errors
                    except ValueError as e:
                        db.session.rollback()
                        return sendJsonResponse(app, 400, "ValueError from auth DB", e)
                    # Catch-all
                    except Exception as e:
                        db.session.rollback()
                        return sendJsonResponse(app, 400, "Error from auth DB", e)

                else:
                    # One or more of the request fields was None/empty
                    return sendJsonResponse(app, 400, "Missing username/email/password")
            else:
                # Non JSON body request rec.
                return invalidJSONResponse
