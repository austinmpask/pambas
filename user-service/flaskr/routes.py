from flask import jsonify, request, make_response
from .models import db, User
import uuid


def configureRoutes(app):
    with app.app_context():
        genericError = jsonify({"Error": "Bad request"})

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
                    return jsonify({"Error": "Invalid UUID"}), 400

                firstName = data.get("first_name")
                lastName = data.get("last_name")

                # Validate that all three items are present and not empty
                if user_uuid and firstName and lastName:
                    # Clean up first and last name
                    firstName = firstName.title()
                    lastName = lastName.title()

                    # Create user in the auth DB and commit
                    # Ensure that constraints and validators are passed
                    try:
                        newUser = User(
                            uuid=user_uuid, firstName=firstName, lastName=lastName
                        )
                        db.session.add(newUser)
                        db.session.commit()

                        # Successfully registered user, return the UUID for use in User service
                        return (
                            jsonify(
                                {
                                    "uuid": str(newUser.uuid),
                                }
                            ),
                            201,
                        )

                    # Catch errors from model constraints
                    except Exception as e:
                        db.session.rollback()
                        return (
                            jsonify(
                                {"Error": "Could not add to user database: " + str(e)}
                            ),
                            400,
                        )
                else:
                    # One or more of the request fields was None/empty
                    return (
                        jsonify({"Error": "Invalid UUID/firstname/lastname"}),
                        400,
                    )
