from flask import Blueprint
from flaskr.utils import sendJsonResponse
from .login import loginBP  # noqa
from .register import registerBP  # noqa
from .shallowdelete import shallowDeleteBP  # noqa

indexBP = Blueprint("index", __name__)


# Healthcheck for gateway docker compose
@indexBP.route("/", methods=["GET"])
def index():
    return sendJsonResponse(200, "OK from auth service")
