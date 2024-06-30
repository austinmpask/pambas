import json
from flask import Blueprint, request
from flaskr.utils import sendJsonResponse, singleLookup
from flaskr.utils.routeDecorators import jsonRequired, uuidRequired
from flaskr.models import db, LineItem
from flaskr.validators import Validators

lineItemBP = Blueprint("lineitem", __name__)


# Return a list of all pending items for a given line item
@lineItemBP.route("/lineitem/<id>/pendingitems", methods=["GET"])
@uuidRequired(True)
def getPendingItemsForLine(userUUID, id):

    # Query for the specific line item
    status, body = singleLookup(LineItem, id, userUUID)

    # Return either the pending items or errors if error
    message = body.getPendingItems() if status == 200 else body
    return sendJsonResponse(status, message)


# Update a line item record, particularly for the flag/checkbox/notes attributes
@lineItemBP.route("/lineitem/<id>", methods=["PUT"])
@jsonRequired
@uuidRequired(False)
def updateLineItem(userUUID, id):

    # Lookup the line item
    status, body = singleLookup(LineItem, id, userUUID)

    # Error response if lookup was not OK
    if status != 200:
        return sendJsonResponse(status, body)

    # Get the request body. Decorator ensured existence
    requestBody = request.get_json()

    # Attempt to update record with validators & sanitation
    try:
        body.flag_marker = Validators.flagMarker(requestBody.get("flagMarker"))
        body.check_boxes = Validators.checkBoxes(requestBody.get("checkBoxes"))
        body.notes = Validators.notes(requestBody.get("notes"))

        db.session.commit()

        # Return the relevant updated attributes only
        return sendJsonResponse(200, json.dumps(body.toDict()))

    # Forward appropriate error messages from validators
    except (ValueError, TypeError) as e:
        db.session.rollback()
        return sendJsonResponse(400, str(e))
    # Catch all
    except Exception as e:
        db.session.rollback()
        return sendJsonResponse(500, f"Database error while updating record: {str(e)}")
