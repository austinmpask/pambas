from flaskr.models import db, User


# Helper to query db for user by UUID. Returns User obj. UUID validated by @uuidRequired decorator
def queryForUserByUUID(userUUID):

    # Attempt to look up UUID
    try:
        user = db.session.query(User).filter_by(uuid=userUUID).first()

    # Catch database error while looking up
    except Exception as e:
        return (500, f"User database error while looking up User: {e}")

    # Handle case of no user found
    if not user:
        return (404, "User not found")

    # Found user, return object
    return (200, user)
