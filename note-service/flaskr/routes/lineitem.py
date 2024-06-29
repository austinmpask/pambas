import json
from flask import Blueprint, request
from flaskr.utils import sendJsonResponse, singleLookup, validateLineItem
from flaskr.utils.routeDecorators import jsonRequired, uuidRequired
from flaskr.models import db, LineItem

lineItemBP = Blueprint("lineitem", __name__)


# Return a list of all pending items for a given line item
@lineItemBP.route("/lineitem/<id>/pendingitems", methods=["GET"])
@uuidRequired(True)
def getPendingItemsForLine(userUUID, id):

    # Query for the specific line item
    query = singleLookup(LineItem, id, userUUID)

    # Error response if lookup was not OK
    if query[0] != 200:
        return sendJsonResponse(*query)

    # Query result will be in 2nd index of tuple if OK
    lineItem = query[1]

    # Return dict of pending items
    return sendJsonResponse(200, lineItem.getPendingItems())


# Update a line item record, particularly for the flag/checkbox/notes attributes
@lineItemBP.route("/lineitem/<id>", methods=["PUT"])
@jsonRequired
@uuidRequired(False)
def updateLineItem(userUUID, id):

    # Lookup the line item
    query = singleLookup(LineItem, id, userUUID)

    # Error response if lookup was not OK
    if query[0] != 200:
        return sendJsonResponse(*query)

    # Query result will be in 2nd index of tuple if OK
    lineItem = query[1]

    # Get the request body. Decorator ensured existence
    requestBody = request.get_json()

    # Validate request body
    errors = validateLineItem(requestBody)

    # Abort if there were validation errors
    if len(errors):
        return sendJsonResponse(400, errors)

    # Update record
    try:
        lineItem.flagMarker = requestBody.get("flagMarker")
        lineItem.checkBoxes = requestBody.get("checkBoxes")
        lineItem.notes = requestBody.get("notes")

        db.session.commit()

        # Return the relevant updated attributes only
        return sendJsonResponse(200, json.dumps(lineItem.toDict()))
    except Exception as e:
        # If theres an error, rollback transaction and provide context
        db.session.rollback()
        return sendJsonResponse(500, f"Database error while updating record: {e}")
