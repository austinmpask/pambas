from flask import Blueprint, request
from flaskr.utils import (
    sendJsonResponse,
    jsonRequired,
    validateSections,
    addProjectWithChildren,
)
import uuid

project_bp = Blueprint("project", __name__)


@project_bp.route("/project", methods=["GET"])
def getProject():
    # TODO
    pass


# Create a new project for a particular user
@project_bp.route("/project", methods=["POST"])
@jsonRequired
def postProject():

    data = request.get_json()

    # Confirm UUID is valid. Gateway adds UUID to the req. body
    try:
        user_uuid = uuid.UUID(data.get("uuid"))
    except Exception as e:
        return sendJsonResponse(400, "Invalid UUID", e)

    # Abort if no data provided with UUID
    if len(data.keys()) < 2:
        return sendJsonResponse(400, "Missing all attributes")

    # Confirm expected request body is recieved
    sections = data.get("sections")

    # Check section integrity
    validation = validateSections(sections)

    # Send error response if something was wrong/missing
    if validation[0] != 200:
        return sendJsonResponse(*validation)

    title = data.get("name")
    projectType = data.get("type")
    manager = data.get("manager")
    budget = data.get("budget")

    # Create the project with all requisite nested table entries
    dbResponse = addProjectWithChildren(
        user_uuid, title, projectType, manager, budget, sections
    )

    # Helper includes error handling for response
    return sendJsonResponse(*dbResponse)
