from flask import Blueprint, request
from flaskr.utils import (
    sendJsonResponse,
    addProjectWithChildren,
    queryProjectsByUUID,
    singleLookup,
    jsonRequired,
    uuidRequired,
)
from flaskr.models import db, Project
from flaskr.validators import Validators


projectBP = Blueprint("project", __name__)


# Get the full details for a specific project
@projectBP.route("/project/<id>", methods=["GET"])
@uuidRequired
def getProject(userUUID, id):

    # Lookup the project
    status, response = singleLookup(Project, id, userUUID)

    # If successful lookup & owned by UUID, return the section details
    if status == 200:
        response = response.toSectionsDict()

    return sendJsonResponse(status, response)


# Delete a project by ID
@projectBP.route("/project/<id>", methods=["DELETE"])
@uuidRequired
def deleteProject(userUUID, id):

    # Lookup the project
    status, body = singleLookup(Project, id, userUUID)

    # Error response if lookup was not OK
    if status != 200:
        return sendJsonResponse(status, body)

    # Attempt to delete the project
    try:
        db.session.delete(body)
        db.session.commit()

        # No DB error, success. Respond with ID of deleted project
        return sendJsonResponse(200, int(id))

    except Exception as e:
        # Rollback and respond with error if DB has error
        db.session.rollback()
        return sendJsonResponse(500, f"Database error while deleting project: {e}")


# Edit the high level summary info for a specific project
@projectBP.route("/project/<id>", methods=["PUT"])
@jsonRequired
@uuidRequired
def putProject(userUUID, id):

    # Validate req body
    reqBody = request.get_json()

    try:
        billed = Validators.billed(reqBody.get("billed"))
        budget = Validators.budget(reqBody.get("budget"))
        checkboxHeaders = Validators.checkboxHeaders(reqBody.get("checkBoxHeaders"))
        projectManager = Validators.projectManager(reqBody.get("projectManager"))
        projectType = Validators.projectType(reqBody.get("projectType"))
        title = Validators.projectTitle(reqBody.get("title"))
        projectID = Validators.fkID(int(id))

    # Forward validation errors
    except (ValueError, TypeError) as e:
        return sendJsonResponse(400, str(e))

    # Catch all
    except Exception as e:
        return sendJsonResponse(500, f"Bad request: {str(e)}")

    # Lookup the project
    status, response = singleLookup(Project, projectID, userUUID)

    # Abort if issue finding project
    if status != 200:
        return sendJsonResponse(status, response)

    # Edit the project
    try:
        response.billed = billed
        response.budget = budget
        response.checkbox_headers = checkboxHeaders
        response.project_manager = projectManager
        response.project_type = projectType
        response.title = title

        # Successful modification
        db.session.commit()
        return sendJsonResponse(200, response.toSummaryDict())

    # Catch validation errors
    except (ValueError, TypeError) as e:
        db.session.rollback()
        return sendJsonResponse(400, str(e))

    # Catch all
    except Exception as e:
        db.session.rollback()
        return sendJsonResponse(500, f"Database error while updating project: {e}")


# Return all projects owned by a user with high level summary information about each
@projectBP.route("/project", methods=["GET"])
@uuidRequired
def getAllProjects(userUUID):

    # Get all the projects for the user
    status, response = queryProjectsByUUID(userUUID)

    # Get the details as a dict for each project if successful lookup
    if status == 200:
        response = [project.toSummaryDict() for project in response]

    # Return the status and error/projects
    return sendJsonResponse(status, response)


# Create a new project for a particular user
@projectBP.route("/project", methods=["POST"])
@jsonRequired
@uuidRequired
def postProject(userUUID):

    reqBody = request.get_json()
    print(reqBody)
    # Validate the incoming data
    try:
        sectionsList = Validators.sectionsList(reqBody.get("sections"))
        title = Validators.projectTitle(reqBody.get("name"))
        projectManager = Validators.projectManager(reqBody.get("manager"))
        type = Validators.projectType("Other")
        budget = Validators.budget(reqBody.get("budget"))

    # Catch validation errors
    except (ValueError, TypeError) as e:
        return sendJsonResponse(400, str(e))
    # Catch all
    except Exception as e:
        return sendJsonResponse(400, f"Bad request: {str(e)}")

    # Create the project with all requisite nested table entries
    status, body = addProjectWithChildren(
        userUUID, title, type, projectManager, budget, sectionsList
    )

    # Helper includes error handling for response
    return sendJsonResponse(status, body)
