from functools import wraps
from flask import request
from .sendJsonResponse import sendJsonResponse


# Decorator to ensure request is JSON for certain routes
def jsonRequired(func):
    @wraps(func)
    def jsonCheck(*args, **kwargs):
        if not request.is_json:
            return sendJsonResponse(400, "Must be JSON request")
        return func(*args, **kwargs)

    return jsonCheck
