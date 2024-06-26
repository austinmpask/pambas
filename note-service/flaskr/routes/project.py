from flask import Blueprint, request
from flaskr.utils import (
    sendJsonResponse,
    jsonRequired,
    validateSections,
    addProjectWithChildren,
    queryProjectsByUUID,
)
from flaskr.models import db

import uuid

project_bp = Blueprint("project", __name__)


# Return all projects owned by a user with high level information about each
@project_bp.route("/project", methods=["GET"])
def getAllProjects():

    try:
        user_uuid = uuid.UUID(request.headers.get("UUID"))
    except Exception as e:
        return sendJsonResponse(400, "Invalid UUID", e)

    # Get all the projects for the user
    projects = queryProjectsByUUID(user_uuid)

    if projects[0] == 200:
        # Get the details as a dict for each project
        projectDicts = [project.toSummaryDict() for project in projects[1]]

        # Send the response to gateway. Includes status code and project dict, or errors
        return sendJsonResponse(200, projectDicts)

    else:
        return sendJsonResponse(*projects)


# Return a specific project for a user by ID
@project_bp.route("/project/<id>", methods=["GET", "PUT"])
def getProject(id):

    # Get the project ID
    projID = int(id)

    # Get UUID
    if request.method == "GET":
        sentUUID = request.headers.get("UUID")

    elif request.method == "PUT":
        data = request.get_json()
        sentUUID = data.get("uuid")

    else:
        return sendJsonResponse(500, "Error")

    # Make sure UUID valid
    try:
        user_uuid = uuid.UUID(sentUUID)
    except Exception as e:
        return sendJsonResponse(400, "Invalid UUID", e)

    # Query for all projects owned by the user
    projects = queryProjectsByUUID(user_uuid)

    if projects[0] != 200:
        return sendJsonResponse(*projects)

    # Of the user's projects, find the one with matching id
    target = next((project for project in projects[1] if project.id == projID), None)

    if not target:
        return sendJsonResponse(404, "Project not found")

    if request.method == "GET":
        # Return project info as dict
        return sendJsonResponse(200, target.toSectionsDict())

    # TODO: Clean up this
    elif request.method == "PUT":

        print(data.get("checkBoxHeaders"))

        target.billed = data.get("billed") or target.billed
        target.budget = data.get("budget") or target.budget
        target.checkboxHeaders = data.get("checkBoxHeaders") or target.checkboxHeaders
        target.projectManager = data.get("projectManager") or target.projectManager
        target.projectType = data.get("projectType") or target.projectType
        target.title = data.get("title") or target.title

        db.session.commit()

        return sendJsonResponse(200, target.toSummaryDict())

    return sendJsonResponse(500, "Error todo here")


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
