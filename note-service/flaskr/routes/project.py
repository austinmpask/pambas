from flask import Blueprint, request
from flaskr.utils import (
    sendJsonResponse,
    jsonRequired,
    validateSections,
    addProjectWithChildren,
    queryProjectsByUUID,
)
import uuid

project_bp = Blueprint("project", __name__)


# Return all projects owned by a user with high level information about each
@project_bp.route("/project", methods=["GET"])
def getAllProjects():

    try:
        user_uuid = uuid.UUID(request.headers.get("UUID"))
    except Exception as e:
        return sendJsonResponse(400, "Invalid UUID", e)

    # Get all the projects for the user. Helper uses Project.toDict()
    projects = queryProjectsByUUID(user_uuid)

    # Send the response to gateway. Includes status code and project dict, or errors
    return sendJsonResponse(*projects)


# Return a specific project for a user by ID
@project_bp.route("/project/<id>", methods=["GET"])
def getProject(id):

    # Get the project ID and UUID
    projID = int(id)

    try:
        user_uuid = uuid.UUID(request.headers.get("UUID"))
    except Exception as e:
        return sendJsonResponse(400, "Invalid UUID", e)

    # Query for all projects owned by the user
    projects = queryProjectsByUUID(user_uuid)

    if projects[0] != 200:
        return sendJsonResponse(*projects)

    # Of the user's projects, find the one with matching id
    target = next((project for project in projects[1] if project["id"] == projID), None)

    if not target:
        return sendJsonResponse(404, "Project not found")

    # Temporarily just return the project to dict
    return sendJsonResponse(200, target)


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
