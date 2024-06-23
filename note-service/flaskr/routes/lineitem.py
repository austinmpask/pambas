from flask import Blueprint, request
from flaskr.utils import (
    sendJsonResponse,
    jsonRequired,
)
from flaskr.models import db, LineItem
import uuid
import json

lineitem_bp = Blueprint("lineitem", __name__)


@lineitem_bp.route("/lineitem/<id>", methods=["PUT"])
@jsonRequired
def updateLineItem(id):

    data = request.get_json()

    # Make sure there was contents in JSON body
    if not data:
        return sendJsonResponse(400, "Bad request")

    # Ensure valid UUID
    try:
        user_uuid = uuid.UUID(data.get("uuid"))
    except Exception as e:
        return sendJsonResponse(400, "Invalid UUID", e)

    # Find the line item in database
    lineItem = db.session.query(LineItem).filter_by(id=id).first()

    # Handle error for not found
    if not lineItem:
        return sendJsonResponse(404, "Line item not found")

    # Make sure it is associated with a project owned by that UUID
    owner = lineItem.section.project.uuid

    if user_uuid != owner:
        return sendJsonResponse(403, "Forbidden")

    # Update the record

    # Check for missing keys, separately, since these may have valid falsey values
    if data.get("flagMarker") is None or data.get("notes") is None:
        return sendJsonResponse(400, "Missing request attributes")

    # Update record
    try:
        lineItem.flagMarker = data.get("flagMarker")
        lineItem.checkBoxes = data.get("checkBoxes") or lineItem.checkBoxes
        lineItem.notes = data.get("notes")

        db.session.commit()

        updatedItem = {
            "flagMarker": lineItem.flagMarker,
            "checkBoxes": lineItem.checkBoxes,
            "notes": lineItem.notes,
        }
        return sendJsonResponse(200, json.dumps(updatedItem))
    except Exception:
        db.session.rollback()
        return sendJsonResponse(500, "Error updating notes DB")
