from flask import Blueprint
from flaskr.utils import sendJsonResponse
from .register import registerBP #noqa
from .userdata import userdataBP #noqa

indexBP = Blueprint("index", __name__)


# Health check route for gateway docker compose
@indexBP.route("/", methods=["GET"])
def index():
    return sendJsonResponse(200, "OK from user service")
