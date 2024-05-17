from flask import jsonify
from .models import db, User
import validators


# Simplify sending responses
def sendJsonResponse(code, message, error=None):
    okCodes = {200, 201}

    status = "Success" if code in okCodes else "Error"
    trace = str(error) if error else "None"

    return (
        jsonify({"code": code, "status": status, "message": message, "trace": trace}),
        code,
    )


# Helper to query db for login
def queryForUser(email=None, username=None):
    # Query for a user using email as default
    user = (
        db.session.query(User).filter_by(email=email).first()
        if email and validators.email(email)
        else db.session.query(User).filter_by(user_name=username).first()
    )

    return user
