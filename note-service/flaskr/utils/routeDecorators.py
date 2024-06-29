import uuid
from functools import wraps
from flask import request
from .sendJsonResponse import sendJsonResponse

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


# Decorator to validate UUID for certain routes. Can be in the header or body
def uuidRequired(header=False):

    # Actual decorator
    def decorator(func):
        @wraps(func)
        def uuidCheck(*args, **kwargs):

            # UUID may be in header or body depending on request type
            # Extract from header
            if header:
                sentUUID = request.headers.get("UUID")

            # Extract from body
            else:
                data = request.get_json()

                # Ensure there was a json req. body
                if not data:
                    return sendJsonResponse(
                        400, f"{genericError} Missing JSON request body"
                    )

                sentUUID = data.get("uuid")

            # Check some kind of data was sent
            if not sentUUID:
                return sendJsonResponse(
                    400, f"{genericError} Missing UUID from request"
                )

            # Check UUID is valid
            try:
                validUUID = uuid.UUID(sentUUID)
            except Exception as e:
                return sendJsonResponse(400, f"{genericError} Invalid UUID: {e}")

            # UUID is valid, pass it to the route handler
            return func(validUUID, *args, **kwargs)

        return uuidCheck

    return decorator
