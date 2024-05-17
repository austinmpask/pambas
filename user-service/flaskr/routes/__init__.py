from flask import Blueprint
from flaskr.util import sendJsonResponse

index_bp = Blueprint("index", __name__)


# Test route for gateway
@index_bp.route("/", methods=["GET"])
def index():
    return sendJsonResponse(200, "ok from user service")


# Temporary test route for JWT auth
@index_bp.route("/protected", methods=["GET"])
def protected():
    return sendJsonResponse(200, "you accessed protected")
