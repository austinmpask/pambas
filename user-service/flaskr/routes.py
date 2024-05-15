from flask import jsonify, request
from .models import db, User
from .util import sendJsonResponse
import uuid


def configureRoutes(app):
    with app.app_context():

        # Register a new user in user DB
        @app.route("/register", methods=["POST"])
        def register():
            if request.is_json:

                # Parse the request body
                data = request.get_json()
                # Catch error if UUID is none or "" or otherwise invalid
                try:
                    user_uuid = uuid.UUID(data.get("uuid"))
                except Exception as e:
                    return sendJsonResponse(app, 400, "Invalid UUID", e)

                firstName = data.get("first_name")
                lastName = data.get("last_name")

                # Validate that all three items are present and not empty
                if user_uuid and firstName and lastName:
                    # Clean up first and last name
                    firstName = firstName.title()
                    lastName = lastName.title()

                    # Create user in the user DB and commit
                    # Ensure that constraints and validators are passed
                    try:
                        newUser = User(
                            uuid=user_uuid, firstName=firstName, lastName=lastName
                        )
                        db.session.add(newUser)
                        db.session.commit()

                        # Successfully registered user, return the UUID for use in User service
                        return sendJsonResponse(app, 201, newUser.uuid)

                    # Catch errors from model constraints
                    except Exception as e:
                        db.session.rollback()
                        return sendJsonResponse(app, 400, "User DB Error", e)
                else:
                    # One or more of the request fields was None/empty
                    return sendJsonResponse(app, 400, "Missing UUID/firstname/lastname")
            else:
                # Non JSON body request rec.
                return sendJsonResponse(app, 400, "Must be JSON request")
