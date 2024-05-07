from flask import jsonify, request, make_response
from flask_bcrypt import Bcrypt
from .models import db, User


def configureRoutes(app):

    bcrypt = Bcrypt(app)

    with app.app_context():
        genericError = jsonify({"Error": "Bad request"})

        @app.route("/login")
        def login():
            return "loginroute"

        # Register a new user
        @app.route("/register", methods=["POST"])
        def register():
            if request.is_json:

                # Parse the request body
                data = request.get_json()

                username = data.get("username")
                email = data.get("email")
                password = data.get("password")

                # Validate that all three items were submitted and are not empty strings
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

                    # Catch model validator errors
                    except ValueError as e:
                        db.session.rollback()
                        return jsonify({"Error": "Validation failed: " + str(e)}), 400
                    # Catch-all
                    except Exception as e:
                        db.session.rollback()
                        return jsonify({"Error": str(e)}), 400

                    # Successfully registered user
                    return (
                        jsonify(
                            {
                                "message": "Success",
                                "username": username,
                                "email": email,
                                "hash": passwordHash,
                            }
                        ),
                        201,
                    )
                else:
                    # One or more of the request fields was None
                    return (
                        jsonify(
                            {"Error": "Must provide email, username, and password"}
                        ),
                        400,
                    )

            return genericError, 400
