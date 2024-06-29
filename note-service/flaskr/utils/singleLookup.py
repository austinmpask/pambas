from flaskr.models import db
from .safetyCheck import safetyCheck


# Query for one object in some table, and ensure that it is owned by the right UUID
def singleLookup(model, id, userUUID):

    # Attempt to find a record in the db
    try:
        result = db.session.query(model).filter_by(id=int(id)).first()
    except Exception as e:
        return (500, f"Database error while querying {model.__tablename__}: {e}")

    # Handle no result case
    if not result:
        return (404, f"No records found while querying {model.__tablename__}")

    # Ensure the record is owned by the UUID requesting it
    if not safetyCheck(result, userUUID):
        return (403, "Forbidden")
    # Record found, return it
    return (200, result)
