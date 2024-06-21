from flask import request, Blueprint
from flaskr.utils import sendJsonResponse, queryProjectsByUUID
import uuid

allProjects_bp = Blueprint("allProjects", __name__)


# Get data about all of a users projects by UUID (name, manager, budget etc.)
@allProjects_bp.route("/allprojects", methods=["GET"])
def getAllProjects():
    # Check if UUID is valid
    try:
        user_uuid = uuid.UUID(request.headers.get("UUID"))
    except Exception as e:
        return sendJsonResponse(400, "Invalid UUID", e)

    # Get all the projects for the user. Helper uses Project.toDict()
    projects = queryProjectsByUUID(user_uuid)

    # Send the response to gateway. Includes status code and project dict, or errors
    return sendJsonResponse(*projects)
