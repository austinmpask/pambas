from flaskr.models import db, User
import validators


# Helper to query db for login
def queryForUser(email=None, username=None):
    # Query for a user using email as default
    user = None
    try:
        if email and validators.email(email):
            user = db.session.query(User).filter_by(email=email).first()

        # TODO add username validator
        elif username:
            user = db.session.query(User).filter_by(user_name=username).first()

        else:
            return (400, "Invalid email/username")

    except:
        return (500, "Auth DB query error")

    if not user:
        return (404, "User not found")

    return user
