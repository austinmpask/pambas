from flaskr.models import LineItem, Project, Section, db


# Helper to create a full project with all of its child elements in the db tables
# Data should be validated by route handler before processing
def addProjectWithChildren(
    userUUID, title, projectType, manager, budget, sectionsList, theme
):
    # Create and add the PROJECT
    try:
        userProject = Project(
            uuid=userUUID,
            title=title,
            budget=budget,
            project_manager=manager,
            project_type=projectType,
            theme=theme,
        )

        db.session.add(userProject)
        db.session.commit()

    except Exception as e:
        # Abort if project couldnt be created
        db.session.rollback()
        return (500, f"Database error while adding Project: {e}")

    # Create the SECTIONS and LINE ITEMS

    dbError = None

    for section in sectionsList:
        # Create a section
        secNum = section["section"]
        controlsNum = section["controls"]

        # Add section to DB, with projectID as foreign key
        try:
            newSection = Section(section_number=secNum, project_id=userProject.id)
            db.session.add(newSection)
            db.session.commit()

        # Catch errors for adding sections, abort process if error occurs
        except Exception as e:
            db.session.rollback()
            dbError = f"Database error while adding Section: {e}"
            break

        # Create the line items which are associated with the successfully created section

        for i in range(controlsNum):
            # Convert control number into a string of XX.XX format
            controlNumber = "{:.2f}".format(float(secNum) + float(i + 1) / 100)

            # Add line item to DB session
            try:
                lineItem = LineItem(
                    control_number=controlNumber, section_id=newSection.id
                )
                db.session.add(lineItem)

            except Exception as e:
                # If there is an error, rollback will get rid of the line items which havent been committed
                db.session.rollback()
                dbError = f"Database error while adding LineItem: {e}"
                break

        # Check if an error occurred before adding the next section
        if dbError:
            break

        # No errors, commit the line items which were added
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            dbError = f"Database error while committing LineItems: {e}"
            break

    # Manually clean up anything added to DB prior to breakage if necessary
    if dbError:
        # Delete project, cascades to children
        db.session.delete(userProject)

        # Send appropriate error message
        db.session.commit()
        return (500, dbError)

    # No errors, return success
    return (
        201,
        userProject.toSummaryDict(),
    )
