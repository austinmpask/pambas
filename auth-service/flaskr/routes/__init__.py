from flask import Blueprint
from flaskr.util import sendJsonResponse

index_bp = Blueprint("index", __name__)


# Test route for gateway
@index_bp.route("/", methods=["GET"])
def index():
    return sendJsonResponse(200, "ok from auth service")
