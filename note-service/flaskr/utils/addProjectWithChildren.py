from flaskr.models import db, Project, Section, LineItem


# Helper to create a full project with all of its child elements in the db tables
def addProjectWithChildren(userUUID, title, projectType, manager, budget, sections):
    if title and projectType and manager and budget and sections:
        # Create the PROJECT
        try:
            userProject = Project(
                uuid=userUUID,
                title=title,
                projectManager=manager,
                budget=int(budget),
                projectType="Other",
            )
            db.session.add(userProject)
            db.session.commit()
        except Exception as e:
            # Catch issue while adding the project to the db
            db.session.rollback()
            return (500, f"Note DB error while creating project: {e}")

        # Create the SECTIONS and LINE ITEMS

        # Save created sections/line items to a list to roll back if necessary.
        # Must commit sections inorder to use as foreign key
        sectionCache = []
        lineItemCache = []

        dbError = None

        for section in sections:
            # Create a section
            secNum = int(section["section"])
            controlsNum = int(section["controls"])

            # Add section to DB
            try:
                newSection = Section(sectionNumber=secNum, projectID=userProject.id)
                db.session.add(newSection)
                db.session.commit()

                # Add created section object to cache
                sectionCache.append(newSection)

            except Exception as e:
                # Catch errors for adding sections, abort process if error occurs
                db.session.rollback()
                dbError = f"Error adding section: {e}"
                break

            # Create the line items which are associated with the new section
            for i in range(controlsNum):
                # Convert control number into a string of XX.XX format
                controlNumber = "{:.2f}".format(float(secNum) + float(i + 1) / 100)

                # Add line item to DB
                try:
                    lineItem = LineItem(
                        controlNumber=controlNumber, sectionID=newSection.id
                    )
                    db.session.add(lineItem)

                    # Add created line item object to cache
                    lineItemCache.append(lineItem)

                except Exception as e:
                    db.session.rollback()
                    dbError = f"Error adding line item: {e}"
                    break

            # Exit process if there was an error adding a line item
            if dbError:
                break

            # No errors, commit the line items which were added
            db.session.commit()

        # Manually clean up anything added to DB prior to breakage if necessary
        if dbError:

            # Delete sections
            for section in sectionCache:
                db.session.delete(section)

            # Delete line items
            for item in lineItemCache:
                db.session.delete(item)

            # Send appropriate error message
            db.session.commit()
            return (500, dbError)

        # No errors, return success
        return (
            201,
            {
                "id": userProject.id,
                "billed": userProject.billed,
                "budget": userProject.budget,
                "checkBoxHeaders": userProject.checkboxHeaders,
                "projectManager": userProject.projectManager,
                "projectType": userProject.projectType,
                "title": userProject.title,
            },
        )

    return (400, "Incomplete request body")
