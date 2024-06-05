from flask import Blueprint
from flaskr.utils import sendJsonResponse

index_bp = Blueprint("index", __name__)


# Health check route for gateway docker compose
@index_bp.route("/", methods=["GET"])
def index():
    return sendJsonResponse(200, "ok from note service")
