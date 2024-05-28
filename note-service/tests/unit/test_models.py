import pytest
import uuid
from flaskr.models import db, ProjectType, Project, Section, LineItem, PendingItem
from flaskr import createApp
from sqlalchemy.exc import IntegrityError, DataError
from datetime import datetime


@pytest.fixture(scope="function")
def app():
    """Fixture to create a clean app context for each test.
    Change made during the test are rolled back."""
    app = createApp()

    with app.app_context():
        db.create_all()

        yield app

        db.session.rollback()
        db.drop_all()


@pytest.fixture(scope="function")
def sampleProject():
    """Provide valid data to make a project"""
    yield {
        "uuid": uuid.uuid4(),
        "title": "sample project",
        "budget": 60,
        "projectManager": "boss man",
        "projectType": ProjectType.SOC_2_TYPE_2,
    }


@pytest.fixture(scope="function")
def sampleSection(app, sampleProject):
    """Create a project, and yield data to create a section"""

    project = Project(**sampleProject)

    db.session.add(project)
    db.session.commit()

    yield {"sectionNumber": 10, "projectID": project.id}


@pytest.fixture(scope="function")
def sampleLineItem(app, sampleSection):
    """Create a project, and yield data to create a line item"""

    section = Section(**sampleSection)

    db.session.add(section)
    db.session.commit()

    yield {"sectionID": section.id}


@pytest.fixture(scope="function")
def samplePendingItem(app, sampleLineItem):
    """Create line item, yield data to create a pending item"""

    lineItem = LineItem(**sampleLineItem)
    db.session.add(lineItem)
    db.session.commit()

    yield {"itemName": "something", "lineItemID": lineItem.id}


################################
# ProjectType Model
################################


def test_timestamp_project(app, sampleProject):
    """Projects should automatically include a timestamp"""
    project = Project(**sampleProject)

    db.session.add(project)
    db.session.commit()
    assert project.created_at is not None, "No timestamp created"


def test_non_nullable_uuid(app, sampleProject):
    """UUID is non nullable"""
    del sampleProject["uuid"]
    project = Project(**sampleProject)
    db.session.add(project)

    with pytest.raises(IntegrityError):
        db.session.commit()


def test_uuid_is_uuid(app, sampleProject):
    """UUID must be valid UUID format"""
    sampleProject["uuid"] = "asdfasdfasdf"
    project = Project(**sampleProject)
    db.session.add(project)
    with pytest.raises(DataError):
        db.session.commit()


def test_non_nullable_title(app, sampleProject):
    """Title is non nullable"""
    del sampleProject["title"]
    project = Project(**sampleProject)
    db.session.add(project)

    with pytest.raises(IntegrityError):
        db.session.commit()


def test_20_char_title(app, sampleProject):
    """Title is limited to 20 characters"""
    sampleProject["title"] = "a" * 21
    project = Project(**sampleProject)
    db.session.add(project)

    with pytest.raises(DataError):
        db.session.commit()


def test_non_nullable_budget(app, sampleProject):
    """Budget hours is non nullable"""
    del sampleProject["budget"]
    project = Project(**sampleProject)
    db.session.add(project)

    with pytest.raises(IntegrityError):
        db.session.commit()


def test_default_billed(app, sampleProject):
    """Billed hours defaults to 0"""
    project = Project(**sampleProject)
    db.session.add(project)
    db.session.commit()

    assert project.billed == 0, "Billed should default to 0"


def test_25_char_pm(app, sampleProject):
    """Project manager is limited to 25 characters"""
    sampleProject["projectManager"] = "a" * 26
    project = Project(**sampleProject)
    db.session.add(project)

    with pytest.raises(DataError):
        db.session.commit()


################################
# Section Model
################################


def test_non_nullable_section_num(app, sampleSection):
    """Section number is non nullable"""
    del sampleSection["sectionNumber"]
    section = Section(**sampleSection)
    db.session.add(section)

    with pytest.raises(IntegrityError):
        db.session.commit()


def test_non_nullable_project_id(app, sampleSection):
    """Project ID foreign key is non nullable"""
    del sampleSection["projectID"]
    section = Section(**sampleSection)
    db.session.add(section)

    with pytest.raises(IntegrityError):
        db.session.commit()


################################
# LineItem Model
################################


def test_line_item_defaults(app, sampleLineItem):
    """Line item fills with default values, only foreign key must be specified"""

    item = LineItem(**sampleLineItem)
    db.session.add(item)
    db.session.commit()

    assert item.flagMarker == False
    assert item.controlNumber == ""
    assert item.checkBoxes == [0, 0, 0]
    assert item.notes == ""


################################
# PendingItem Model
################################


def test_timestamp_pending_item(app, samplePendingItem):
    """Pending items should automatically include a timestamp"""
    pendingItem = PendingItem(**samplePendingItem)

    db.session.add(pendingItem)
    db.session.commit()
    assert pendingItem.created_at is not None, "No timestamp created"


def test_non_nullable_pending_item(app, samplePendingItem):
    """Pending item name is non nullable"""
    del samplePendingItem["itemName"]
    pendingItem = PendingItem(**samplePendingItem)
    db.session.add(pendingItem)

    with pytest.raises(IntegrityError):
        db.session.commit()


def test_pending_item_defaults(app, samplePendingItem):
    """Pending fills with default values, only foreign key and name must be specified"""

    item = PendingItem(**samplePendingItem)
    db.session.add(item)
    db.session.commit()

    assert item.description == ""
    assert item.controlOwner == ""
    assert item.lastContactDate == None
