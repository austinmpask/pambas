from flaskr.models import db, User


# Helper to query db for user by UUID. Returns User obj
def queryForUserByUUID(uuid):
    try:
        user = db.session.query(User).filter_by(uuid=uuid).first()
    except:
        return (500, "User DB query error")

    if not user:
        return (404, "User not found")

    return user
