from flask import Blueprint, request
from flaskr.util import sendJsonResponse
from flaskr.models import db, Project, Section, LineItem, projectTypes
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
            for section in sections:
                # Abort if empty section or control #
                if not section["section"] or not section["controls"]:
                    return sendJsonResponse(400, "Missing section/control number")

            # Abort if duplicate section numbers present
            keys = [item["section"] for item in sections]
            uniques = set(keys)
            if len(uniques) != len(keys):
                return sendJsonResponse(400, "Duplicate section numbers not allowed!")

            if title and projectType and manager and budget and sections:

                # Create the project
                try:
                    userProject = Project(
                        uuid=user_uuid,
                        title=title,
                        projectManager=manager,
                        budget=int(budget),
                        projectType=projectTypes[projectType],
                    )
                    db.session.add(userProject)
                    db.session.commit()
                except Exception as e:
                    db.session.rollback()
                    return sendJsonResponse(
                        400, "Note DB error while creating project", e
                    )

                # Create the sections/line items
                sectionError = False
                controlError = False

                sectionCache = []
                lineItemCache = []

                for section in sections:
                    # Create a section
                    secNum = section["section"]
                    controlsNum = section["controls"]
                    try:
                        newSection = Section(
                            sectionNumber=int(secNum), projectID=userProject.id
                        )
                        db.session.add(newSection)
                        db.session.commit()
                        sectionCache.append(newSection)
                    except Exception as e:
                        db.session.rollback()
                        sectionError = True
                        break

                    # Create the associated line items
                    for i in range(int(controlsNum)):
                        controlNumber = str(float(secNum) + float(i + 1) / 10)
                        try:
                            lineItem = LineItem(
                                controlNumber=controlNumber, sectionID=newSection.id
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

                # No errors, return success
                return sendJsonResponse(201, "Project added")

            else:
                return sendJsonResponse(400, "Incomplete request body")

        else:
            return sendJsonResponse(400, "Must be JSON request")
