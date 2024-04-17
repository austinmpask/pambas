import pytest
from flaskr.models import (
    db,
    Domain,
    User,
    ProjectType,
    UserProject,
    SectionType,
    ProjectSection,
    LineItem,
)
from flaskr import createApp
from sqlalchemy.exc import IntegrityError, DataError
from datetime import datetime


@pytest.fixture(scope="function")
def app():
    """Fixture to create a clean app context for each test.
    Change made during the test are rolled back."""
    app = createApp(testing=True)

    with app.app_context():
        yield app
        db.session.rollback()


@pytest.fixture(scope="function")
def sample_user(app):
    """Create and commit valid domain"""
    domain = Domain(domain_name="Example domain")

    with app.app_context():
        db.session.add(domain)
        db.session.commit()

        """Provide dictionary with valid user data"""
        return {
            "user_name": "username",
            "email": "email@website.com",
            "password_hash": "xxxxxxxxxxxx",
            "domain_id": domain.id,
        }


@pytest.fixture(scope="function")
def sample_project_type():
    """Provides a dictionary with a valid project type"""
    return {"project_type": "SOC 2 Type 1"}


@pytest.fixture(scope="function")
def sample_section_type():
    """Provides a dictionary with a valid section type"""
    return {"section_type": "Communication", "default_section_number": 2}


@pytest.fixture(scope="function")
def sample_user_project(app, sample_user, sample_project_type):
    """Create and commit valid user and project type"""
    projectType = ProjectType(**sample_project_type)
    user = User(**sample_user)
    with app.app_context():
        db.session.add_all([user, projectType])
        db.session.commit()

        """Provide valid data for making a user project"""
        return {
            "user_project_name": "Valid name",
            "user_project_issuance": datetime.now(),
            "user_project_budget": 60,
            "user_project_billed": 2,
            "project_type_id": projectType.id,
            "user_id": user.id,
        }


@pytest.fixture(scope="function")
def sample_project_section(app, sample_section_type, sample_user_project):
    """Create and commit a sample valid user project and section type"""
    project = UserProject(**sample_user_project)
    sectionType = SectionType(**sample_section_type)

    with app.app_context():
        db.session.add_all([project, sectionType])
        db.session.commit()

        """Provide valid data for making a project section"""
        return {
            "custom_section_number": None,
            "custom_section_type": None,
            "created_at": datetime.now(),
            "section_type_id": sectionType.id,
            "user_project_id": project.id,
        }


@pytest.fixture(scope="function")
def sample_line_item(app, sample_project_section):
    """Create and commit a sample project section"""
    section = ProjectSection(**sample_project_section)

    with app.app_context():
        db.session.add(section)
        db.session.commit()

        """Provide valid data for making a line item"""
        return {
            "flag": None,
            "item": "word",
            "created_at": datetime.now(),
            "project_section_id": section.id,
        }


################################
# Domain Model
################################


def test_timestamp_domain(app):
    """Domain records should automatically include a timestamp"""
    domain = Domain(domain_name="ValidName")
    with app.app_context():
        db.session.add(domain)
        db.session.commit()
        assert domain.created_at is not None


def test_unique_domain_name(app):
    """Domain name must be unique"""
    name = "test"
    domain1 = Domain(domain_name=name)
    domain2 = Domain(domain_name=name)

    with app.app_context():
        db.session.add_all([domain1, domain2])
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_non_nullable_domain_name(app):
    """Domain name should be non nullable"""
    domain = Domain()
    with app.app_context():
        db.session.add(domain)
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_max_length_domain_name(app):
    """Domain name should adhere to a maximum length of 60 characters"""
    domain = Domain(domain_name=("a" * 61))
    with app.app_context():
        db.session.add(domain)
        with pytest.raises(DataError):
            db.session.commit()


################################
# User Model
################################


def test_timestamp_user(app, sample_user):
    """User records should automatically include a timestamp"""
    user = User(**sample_user)
    with app.app_context():
        db.session.add(user)
        db.session.commit()
        assert user.created_at is not None


def test_unique_user_name(app, sample_user):
    """User name must be unique"""
    sample_user["email"] = "email1@gmail.com"
    user1 = User(**sample_user)
    sample_user["email"] = "email2@gmail.com"
    user2 = User(**sample_user)

    with app.app_context():
        db.session.add_all([user1, user2])
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_unique_email(app, sample_user):
    """User email must be unique"""
    sample_user["user_name"] = "user1"
    user1 = User(**sample_user)
    sample_user["user_name"] = "user2"
    user2 = User(**sample_user)

    with app.app_context():
        db.session.add_all([user1, user2])
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_non_nullable_user_name(app, sample_user):
    """User name should be non nullable"""
    del sample_user["user_name"]
    user = User(**sample_user)
    with app.app_context():
        db.session.add(user)
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_non_nullable_email(app, sample_user):
    """Email name should be non nullable"""
    del sample_user["email"]
    user = User(**sample_user)
    with app.app_context():
        db.session.add(user)
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_non_nullable_domain_id(app, sample_user):
    """User must be associated with a domain"""
    del sample_user["domain_id"]
    user = User(**sample_user)
    with app.app_context():
        db.session.add(user)
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_max_length_user_name(app, sample_user):
    """User name should adhere to a maximum length of 20 characters"""
    sample_user["user_name"] = "a" * 21
    user = User(**sample_user)
    with app.app_context():
        db.session.add(user)
        with pytest.raises(DataError):
            db.session.commit()


def test_max_length_email(app, sample_user):
    """Email should adhere to a maximum length of 100 characters"""
    sample_user["email"] = "a" * 101
    user = User(**sample_user)
    with app.app_context():
        db.session.add(user)
        with pytest.raises(DataError):
            db.session.commit()


# FIX, BCRYPT WILL BE SPECIFICALLY 60 CHAR
def test_length_password_hash(app, sample_user):
    """Password hash should adhere to a maximum length of 60 characters"""
    sample_user["password_hash"] = "a" * 61
    user = User(**sample_user)
    with app.app_context():
        db.session.add(user)
        with pytest.raises(DataError):
            db.session.commit()


################################
# Project Type Model
################################


def test_unique_project_type(app, sample_project_type):
    """Project type must be unique"""
    proj1 = ProjectType(**sample_project_type)
    proj2 = ProjectType(**sample_project_type)
    with app.app_context():
        db.session.add_all([proj1, proj2])
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_non_nullable_project_type(app, sample_project_type):
    """Project type should be non nullable"""
    del sample_project_type["project_type"]
    proj = ProjectType(**sample_project_type)
    with app.app_context():
        db.session.add(proj)
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_max_length_project_type(app, sample_project_type):
    """Project type name should adhere to a maximum length of 60 characters"""
    sample_project_type["project_type"] = "a" * 61
    proj = ProjectType(**sample_project_type)
    with app.app_context():
        db.session.add(proj)
        with pytest.raises(DataError):
            db.session.commit()


################################
# User Project Model
################################


def test_timestamp_user_project(app, sample_user_project):
    """User project records should automatically include a timestamp"""
    proj = UserProject(**sample_user_project)
    with app.app_context():
        db.session.add(proj)
        db.session.commit()
        assert proj.created_at is not None


def test_non_nullable_user_project_name(app, sample_user_project):
    """User project name should be non nullable"""
    del sample_user_project["user_project_name"]
    proj = UserProject(**sample_user_project)
    with app.app_context():
        db.session.add(proj)
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_non_nullable_user_project_issuance(app, sample_user_project):
    """User project issuance date should be non nullable"""
    del sample_user_project["user_project_issuance"]
    proj = UserProject(**sample_user_project)
    with app.app_context():
        db.session.add(proj)
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_non_nullable_user_project_type_id(app, sample_user_project):
    """User project type should be non nullable"""
    del sample_user_project["project_type_id"]
    proj = UserProject(**sample_user_project)
    with app.app_context():
        db.session.add(proj)
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_non_nullable_user_project_user_id(app, sample_user_project):
    """User project owner (user_id) should be non nullable"""
    del sample_user_project["user_id"]
    proj = UserProject(**sample_user_project)
    with app.app_context():
        db.session.add(proj)
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_max_length_user_project_name(app, sample_user_project):
    """Project name should adhere to a maximum length of 60 characters"""
    sample_user_project["user_project_name"] = "a" * 61
    proj = UserProject(**sample_user_project)
    with app.app_context():
        db.session.add(proj)
        with pytest.raises(DataError):
            db.session.commit()


def test_default_user_project_budget(app, sample_user_project):
    """Project budget should default to 0 if unspecified"""
    del sample_user_project["user_project_budget"]
    proj = UserProject(**sample_user_project)
    with app.app_context():
        db.session.add(proj)
        db.session.commit()
        assert proj.user_project_budget == 0


def test_default_user_project_billed(app, sample_user_project):
    """Project billed should default to 0 if unspecified"""
    del sample_user_project["user_project_billed"]
    proj = UserProject(**sample_user_project)
    with app.app_context():
        db.session.add(proj)
        db.session.commit()
        assert proj.user_project_billed == 0


################################
# Section Type Model
################################


def test_non_nullable_section_type_name(app, sample_section_type):
    """Section type name should be non nullable"""
    del sample_section_type["section_type"]
    section = SectionType(**sample_section_type)
    with app.app_context():
        db.session.add(section)
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_non_nullable_default_section_type_number(app, sample_section_type):
    """Section type default number should be non nullable"""
    del sample_section_type["default_section_number"]
    section = SectionType(**sample_section_type)
    with app.app_context():
        db.session.add(section)
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_max_length_section_type_name(app, sample_section_type):
    """Section type name should adhere to a maximum length of 60 characters"""
    sample_section_type["section_type"] = "a" * 61
    section = SectionType(**sample_section_type)
    with app.app_context():
        db.session.add(section)
        with pytest.raises(DataError):
            db.session.commit()


################################
# Project Section Model
################################


def test_timestamp_project_section(app, sample_project_section):
    """Project section records should automatically include a timestamp"""
    section = ProjectSection(**sample_project_section)
    with app.app_context():
        db.session.add(section)
        db.session.commit()
        assert section.created_at is not None


def test_builtin_section_type_overrides_custom(app, sample_project_section):
    """If a project is built using a section_type_id foreign key,
    the custom_section_type and custom_section_number will always be Null"""

    """Sample project section includes a valid foreign key reference, and custom fields set to None"""
    section1 = ProjectSection(**sample_project_section)

    """Populate sample custom data to be supplied along with valid foreign key"""
    sample_project_section["custom_section_number"] = 32
    sample_project_section["custom_section_type"] = "custom"

    section2 = ProjectSection(**sample_project_section)

    with app.app_context():
        db.session.add_all([section1, section2])
        db.session.commit()
        assert (
            section1.custom_section_number is None
            and section1.custom_section_type is None
            and section2.custom_section_number is None
            and section2.custom_section_type is None
        )


def test_no_builtin_section_type_or_custom_type_raise(app, sample_project_section):
    """If a project's section_type_id foreign key is null,
    and custom_section_type and custom_section_number are not populated,
    an error is raised"""

    sample_project_section["section_type_id"] = None

    section = ProjectSection(**sample_project_section)

    with app.app_context():
        db.session.add(section)
        with pytest.raises():
            db.session.commit()


def test_valid_custom_type(app, sample_project_section):
    """If a project's section_type_id foreign key is null,
    and custom_section_type and custom_section_number are populated,
    custom section is assigned"""

    custom = "customtype"

    sample_project_section["section_type_id"] = None
    sample_project_section["custom_section_number"] = 32
    sample_project_section["custom_section_type"] = custom

    section = ProjectSection(**sample_project_section)

    with app.app_context():
        db.session.add(section)
        db.session.commit()
        assert (
            section.custom_section_number == 32
            and section.custom_section_type == custom
            and section.section_type_id is None
        )


# FIX, this should be nullable later
# def test_non_nullable_project_section_number(app, sample_project_section):
#     """Project section number should be non nullable"""
#     del sample_project_section["section_number"]
#     section = ProjectSection(**sample_project_section)
#     with app.app_context():
#         db.session.add(section)
#         with pytest.raises(IntegrityError):
#             db.session.commit()


# def test_nullable_project_section_custom_type(app, sample_project_section):
#     """Project section custom type should be nullable"""
#     section = ProjectSection(**sample_project_section)
#     with app.app_context():
#         db.session.add(section)
#         db.session.commit()
#         assert section.custom_section_type is None


# def test_non_nullable_project_section_type_id(app, sample_project_section):
#     """Project section type id should be non nullable"""
#     del sample_project_section["section_type_id"]
#     section = ProjectSection(**sample_project_section)
#     with app.app_context():
#         db.session.add(section)
#         with pytest.raises(IntegrityError):
#             db.session.commit()


def test_non_nullable_project_section_user_project_id(app, sample_project_section):
    """Project section user id should be non nullable"""
    del sample_project_section["user_project_id"]
    section = ProjectSection(**sample_project_section)
    with app.app_context():
        db.session.add(section)
        with pytest.raises(IntegrityError):
            db.session.commit()


################################
# Line Item Model
################################


def test_timestamp_line_item(app, sample_line_item):
    """Line item records should automatically include a timestamp"""
    item = LineItem(**sample_line_item)
    with app.app_context():
        db.session.add(item)
        db.session.commit()
        assert item.created_at is not None


def test_non_nullable_line_item_section_id(app, sample_line_item):
    """Line item section id should be non nullable"""
    del sample_line_item["project_section_id"]
    item = LineItem(**sample_line_item)
    with app.app_context():
        db.session.add(item)
        with pytest.raises(IntegrityError):
            db.session.commit()


def test_default_line_item_flag(app, sample_line_item):
    """Line item flag should default to False if unspecified"""
    item = LineItem(**sample_line_item)
    with app.app_context():
        db.session.add(item)
        db.session.commit()
        assert item.flag == False


def test_default_line_item_item(app, sample_line_item):
    """Line item item/note should default to empty string if unspecified"""
    del sample_line_item["item"]
    item = LineItem(**sample_line_item)
    with app.app_context():
        db.session.add(item)
        db.session.commit()
        assert item.item == ""
