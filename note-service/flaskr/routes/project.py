from flask import Blueprint
from flaskr.util import sendJsonResponse
from flaskr.models import db, Project, Section, LineItem
import uuid

project_bp = Blueprint("project", __name__)


@project_bp.route("/project", methods=["GET", "POST"])
def project():

    if request.method == "GET":
        pass

    # Create a new project for a particular user
    if request.method == "POST":

        if request.is_json:

            data = request.get_json()

            # Confirm UUID is valid. Gateway adds UUID to the req. body
            try:
                user_uuid = uuid.UUID(data["uuid"])
            except Exception as e:
                return sendJsonResponse(400, "Missing/invalid UUID", e)

            # Abort if no data provided with UUID
            if len(data.keys()) < 2:
                return sendJsonResponse(400, "Missing all attributes")

            # Confirm expected request body is recieved
            title = data.get("name")
            projectType = data.get("type")
            manager = data.get("manager")
            budget = data.get("budget")
            sections = data.get("sections")

            # Check section integrity
            for section, controls in sections.items():
                # Abort if empty section or control #
                if not section or not controls:
                    return sendJsonResponse(400, "Missing section/control number")

            # Abort if duplicate section numbers present
            keys = sections.keys()
            uniques = set(keys)
            if len(uniques) != len(keys):
                return sendJsonResponse(400, "Duplicate section numbers not allowed!")

            if title and projectType and manager and budget and sections:

                # Create the project
                try:
                    userProject = Project(
                        uuid=user_uuid, title=name, budget=int(budget)
                    )
                    db.session.add(userProject)
                    db.session.commit()
                except Exception as e:
                    db.session.rollback()
                    return sendJsonResponse(400, "Note DB error while creating project")

                # Create the sections/line items
                sectionError = False
                controlError = False

                sectionCache = []
                lineItemCache = []
                for section, controls in sections.items():
                    # Create a section
                    try:
                        section = Section(
                            sectionNumber=int(section), projectID=userProject.id
                        )
                        db.session.add(section)
                        db.session.commit()
                        sectionCache.append(section)
                    except Exception as e:
                        db.session.rollback()
                        sectionError = True
                        break

                    # Create the associated line items
                    for i in range(int(controls)):
                        controlNumber = str(float(section) + float(i + 1) / 10)
                        try:
                            lineItem = LineItem(
                                controlNumber=controlNumber, sectionID=section.id
                            )
                            db.session.add(lineItem)
                        except Exception as e:
                            db.session.rollback()
                            sectionError = True
                            controlError = True
                            break

                    if controlError:
                        break

                    # Commit the line items for that section
                    db.session.commit()

                # Manually clean up anything added to DB prior to breakage if necessary
                if sectionError:
                    for section in sectionCache:
                        db.session.delete(section)

                    db.session.commit()
                    return sendJsonResponse(500, "Note DB error while adding section")

                if controlError:
                    for control in controlCache:
                        db.session.delete(control)

                    db.session.commit()
                    return sendJsonResponse(500, "Note DB error while adding control")

            else:
                return sendJsonResponse(400, "Incomplete request body")

        else:
            return sendJsonResponse(400, "Must be JSON request")
