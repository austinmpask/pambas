from flaskr.models import db, Project, Section, LineItem


# Helper to create a full project with all of its child elements in the db tables
# Data should be validated by route handler before processing
def addProjectWithChildren(userUUID, title, projectType, manager, budget, sectionsList):

    # Create and add the PROJECT
    try:
        userProject = Project(
            uuid=userUUID,
            title=title,
            budget=budget,
            project_manager=manager,
            project_type=projectType,
        )

        db.session.add(userProject)
        db.session.commit()

    except Exception as e:
        # Abort if project couldnt be created
        db.session.rollback()
        return (500, f"Database error while adding Project: {e}")

    # Create the SECTIONS and LINE ITEMS

    # Save created sections/line items to a list to roll back if necessary.
    # Must commit sections inorder to use as foreign key
    sectionCache = []
    lineItemCache = []

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

            # Add created section object to cache incase of need for manual removal
            sectionCache.append(newSection)

        # Catch errors for adding sections, abort process if error occurs
        except Exception as e:
            db.session.rollback()
            dbError = f"Database error while adding Section: {e}"
            break

        # Create the line items which are associated with the successfully created section

        localLineItemCache = []

        for i in range(controlsNum):
            # Convert control number into a string of XX.XX format
            controlNumber = "{:.2f}".format(float(secNum) + float(i + 1) / 100)

            # Add line item to DB session
            try:
                lineItem = LineItem(
                    control_number=controlNumber, section_id=newSection.id
                )
                db.session.add(lineItem)

                # Add created line item object to a locally scoped cache
                localLineItemCache.append(lineItem)

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

        # Add the successfully added line item objects to the cache incase a future error requires manual removal
        lineItemCache.extend(localLineItemCache)

    # Manually clean up anything added to DB prior to breakage if necessary
    if dbError:

        # Delete project
        db.session.delete(userProject)

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
        userProject.toSummaryDict(),
    )
