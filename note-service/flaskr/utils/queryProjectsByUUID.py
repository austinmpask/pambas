from flaskr.models import db, Project


# Helper to query db for all a user's projects by UUID. UUID is validated with @uuidRequired decorator
def queryProjectsByUUID(userUUID):
    try:
        projects = db.session.query(Project).filter_by(uuid=userUUID).all()
    except Exception:
        return (500, "Database error while querying user projects")

    # No results case
    if not projects:
        return (404, "No projects found")

    # Return the user's project objs in a list
    return (200, projects)
