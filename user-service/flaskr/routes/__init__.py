from flask import Blueprint
from flaskr.utils import sendJsonResponse
from .register import registerBP
from .userdata import userdataBP

indexBP = Blueprint("index", __name__)


# Health check route for gateway docker compose
@indexBP.route("/", methods=["GET"])
def index():
    return sendJsonResponse(200, "OK from user service")
