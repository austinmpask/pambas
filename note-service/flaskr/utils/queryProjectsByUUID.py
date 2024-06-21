from flaskr.models import db, Project


# Helper to query db for all a user's projects by UUID
def queryProjectsByUUID(uuid):
    try:
        projects = db.session.query(Project).filter_by(uuid=uuid).all()
    except Exception:
        return (500, "Note DB query error")

    if not projects:
        return (404, "No projects found")

    # Get the details as a dict for each project
    projectDicts = [project.toDict() for project in projects]

    return (200, projectDicts)
