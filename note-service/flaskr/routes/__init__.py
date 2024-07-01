from flask import Blueprint
from flaskr.utils import sendJsonResponse
from .lineItem import lineItemBP  # noqa
from .openItem import openItemBP  # noqa
from .project import projectBP  # noqa

indexBP = Blueprint("index", __name__)


# Health check route for gateway docker compose
@indexBP.route("/", methods=["GET"])
def index():
    return sendJsonResponse(200, "OK from note service")
