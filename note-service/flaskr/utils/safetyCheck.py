from flaskr.models import Project, Section, LineItem, PendingItem


# Ensure that a queried record is owned by the UUID requesting it
def safetyCheck(record, userUUID):

    # Determine the object type
    objType = type(record)

    # Traverse the schema heirarchy to find the owner which is associated with Project
    if objType is Project:
        owner = record.uuid

    elif objType is Section:
        owner = record.project.uuid

    elif objType is LineItem:
        owner = record.section.project.uuid

    elif objType is PendingItem:
        owner = record.lineItem.section.project.uuid

    else:
        raise ValueError(f"Unexpected type: {objType}")

    # Return true if the objects are the same
    return owner == userUUID
