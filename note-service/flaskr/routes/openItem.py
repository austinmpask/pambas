from flask import Blueprint, request
from flaskr.utils import sendJsonResponse, singleLookup
from flaskr.utils.routeDecorators import jsonRequired, uuidRequired
from flaskr.models import db, LineItem, PendingItem
from flaskr.validators import Validators
from datetime import datetime

openItemBP = Blueprint("openItem", __name__)


# Update the followup date to current date for an open item
@openItemBP.route("/openitem/<id>/followup", methods=["PUT"])
@jsonRequired
@uuidRequired(False)
def followupOnItem(userUUID, id):

    # Query for the specific open item
    status, body = singleLookup(PendingItem, id, userUUID)

    # Error response if lookup was not OK
    if status != 200:
        return sendJsonResponse(status, body)

    # Attempt to update date
    try:
        body.lastContactDate = Validators.lastContactDate(datetime.now())
        db.session.commit()

    # Forward appropriate error messages from validators
    except (ValueError, TypeError) as e:
        db.session.rollback()
        return sendJsonResponse(400, e)

    except Exception as e:
        # Rollback and forward error status
        db.session.rollback()
        return sendJsonResponse(
            500, f"Database error while updating followup date: {e}"
        )

    # Respond with the new date if successful
    return sendJsonResponse(200, body.lastContactDate)


# Delete an open item
@openItemBP.route("/openitem/<id>", methods=["DELETE"])
@uuidRequired(True)
def deleteOpenItem(userUUID, id):

    # Query for the specific open item
    status, body = singleLookup(PendingItem, id, userUUID)

    # Error response if lookup was not OK
    if status != 200:
        return sendJsonResponse(status, body)

    # Attempt to delete the item
    try:
        db.session.delete(body)
        db.session.commit()

        # No DB error, success. Respond with ID of deleted item
        return sendJsonResponse(200, int(id))

    except Exception as e:
        # Rollback and respond with error if DB has error
        db.session.rollback()
        return sendJsonResponse(500, f"Database error while deleting open item: {e}")


# Modify open item details (name, owner, description)
@openItemBP.route("/openitem/<id>", methods=["PUT"])
@jsonRequired
@uuidRequired(False)
def putOpenItem(userUUID, id):

    # Query for the specific open item
    status, body = singleLookup(PendingItem, id, userUUID)

    # Error response if lookup was not OK
    if status != 200:
        return sendJsonResponse(status, body)

    reqBody = request.get_json()

    # Attempt to update DB
    try:
        body.itemName = Validators.itemName(reqBody.get("itemName"))
        body.controlOwner = Validators.controlOwner(reqBody.get("controlOwner"))
        body.description = Validators.description(reqBody.get("description"))

        db.session.commit()

        # Success, forward record information
        return sendJsonResponse(200, body.toDict())

    # Forward appropriate error messages from validators
    except (ValueError, TypeError) as e:
        db.session.rollback()
        return sendJsonResponse(400, str(e))
    # Catch all
    except Exception as e:
        db.session.rollback()
        return sendJsonResponse(500, f"Database error while updating record: {str(e)}")


# Create an open item associated with line item ID provided thru req body
@openItemBP.route("/openitem", methods=["POST"])
@jsonRequired
@uuidRequired(False)
def postOpenItem(userUUID):

    # Parse req body
    reqBody = request.get_json()

    # First validate line item id FK
    try:
        lineItemID = Validators.fkID(reqBody.get("lineID"))
    except (ValueError, TypeError) as e:
        return sendJsonResponse(500, str(e))

    # Look up the line id to make sure it exists in db and is owned by the user
    status, body = singleLookup(LineItem, lineItemID, userUUID)
    if status != 200:
        return sendJsonResponse(status, body)

    # Line item valid and owned by UUID, get rest of data
    try:
        itemName = Validators.itemName(reqBody.get("itemName"))
        controlOwner = Validators.controlOwner(reqBody.get("controlOwner"))
        description = Validators.description(reqBody.get("description"))

        newItem = PendingItem(
            itemName=itemName,
            controlOwner=controlOwner,
            description=description,
            lineItemID=lineItemID,
        )

        db.session.add(newItem)
        db.session.commit()

    # Catch validation errors
    except (ValueError, TypeError) as e:
        db.session.rollback()
        return sendJsonResponse(400, str(e))

    # Catchall
    except Exception as e:
        db.session.rollback()
        return sendJsonResponse(500, f"Database error while adding record: {str(e)}")

    # Successfull addition
    return sendJsonResponse(201, newItem.toDict())
