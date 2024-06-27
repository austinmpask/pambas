from flask import Blueprint, request
from flaskr.utils import (
    sendJsonResponse,
    jsonRequired,
)
from flaskr.models import db, PendingItem

import uuid
from datetime import datetime

openItemBp = Blueprint("openItem", __name__)


@openItemBp.route("/openitem/<id>/followup", methods=["PUT"])
def followupOnItem(id):
    itemID = int(id)

    item = db.session.query(PendingItem).filter_by(id=itemID).first()

    if not item:
        return sendJsonResponse(404, "Item not found")

    try:

        item.lastContactDate = datetime.now()

        db.session.commit()

    except Exception as e:
        return sendJsonResponse(500, "add error handling here for put followup")

    return sendJsonResponse(200, item.lastContactDate)


@openItemBp.route("/openitem/<id>", methods=["DELETE"])
def deleteOpenItem(id):

    itemID = int(id)
    # TODO: safety checks for ownership

    openItem = db.session.query(PendingItem).filter_by(id=itemID).first()

    if not openItem:
        return sendJsonResponse(404, "Item not found")

    # TODO error handling

    try:

        db.session.delete(openItem)

        db.session.commit()

    except Exception as e:
        return sendJsonResponse(
            500, "DB error removing open item, add error handling todo"
        )

    return sendJsonResponse(200, itemID)


@openItemBp.route("/openitem", methods=["POST"])
@jsonRequired
def postOpenItem():
    data = request.get_json()

    # Confirm UUID is valid. Gateway adds UUID to the req. body
    try:
        user_uuid = uuid.UUID(data.get("uuid"))
    except Exception as e:
        return sendJsonResponse(400, "Invalid UUID", e)

    # Abort if no data provided with UUID
    if len(data.keys()) < 2:
        return sendJsonResponse(400, "Missing all attributes")

    # TODO: Validation, safety check to make sure user owns the line item

    itemName = data.get("itemName")
    controlOwner = data.get("controlOwner")
    description = data.get("description")
    lineItemID = data.get("lineID")
    print(data)

    newItem = PendingItem(
        itemName=itemName,
        controlOwner=controlOwner,
        description=description,
        lineItemID=lineItemID,
    )

    # TODO: Error handling try except etc.
    try:

        db.session.add(newItem)

        db.session.commit()

    except Exception as e:
        return sendJsonResponse(
            500, "DB Error adding open item, Add error handling here"
        )

    return sendJsonResponse(201, newItem.toDict())
