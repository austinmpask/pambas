from functools import wraps
from flask import request
from .sendJsonResponse import sendJsonResponse
from flaskr.validators import Validators

genericError = "Bad Request:"


# Decorator to ensure request is JSON for certain routes
def jsonRequired(func):
    @wraps(func)
    def jsonCheck(*args, **kwargs):
        # Only json request allowed
        if not request.is_json:
            return sendJsonResponse(
                400, f"{genericError} Invalid request type, JSON required"
            )
        return func(*args, **kwargs)

    return jsonCheck


# Decorator to validate UUID for certain routes.
def uuidRequired(func):

    @wraps(func)
    def uuidCheck(*args, **kwargs):

        # Extract from header
        sentUUID = request.headers.get("userUUID")

        # Check UUID is valid
        try:
            validUUID = Validators.stringUUID(sentUUID)
        except Exception as e:
            return sendJsonResponse(400, f"{genericError} Invalid UUID: {e}")

        # UUID is valid, pass it to the route handler
        return func(validUUID, *args, **kwargs)

    return uuidCheck
