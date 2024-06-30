from flaskr.models import db, User


# Helper to query db for login based on a credential
def queryForUser(credentials):
    # Query for a user using email as default
    isEmail, credential = credentials

    # Attempt lookup
    try:
        # Case of email
        if isEmail:
            user = db.session.query(User).filter_by(email=credential).first()

        # Case of username
        else:
            user = db.session.query(User).filter_by(user_name=credential).first()

        # Send OK status if user found, 404 if no match
        status = 200 if user else 404

        return (status, user)

    # Catch DB error
    except Exception as e:
        return (500, f"Auth database error while looking up User: {str(e)}")
