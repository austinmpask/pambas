# Ensure request body is valid for PUT /lineitem/id

# Must have:

# flagMarker
# notes
# checkBoxes


def validateLineItem(requestBody):

    errors = []

    # Extract required elements from request body
    flagMarker = requestBody.get("flagMarker")
    notes = requestBody.get("notes")
    checkBoxes = requestBody.get("checkBoxes")

    # flagMarker and notes can have valid falsey values, checkBox falsey would be invalid
    if flagMarker is None:
        errors.append("Flag marker key missing")

    if notes is None:
        errors.append("Notes key missing")

    if not checkBoxes:
        errors.append("Checkboxes key missing")

    # Return list of errors if any, or else empty list
    return errors
