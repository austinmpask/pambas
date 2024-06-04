import pytest
import uuid
from flaskr.models import db, User
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
def sampleUser(app):
    """Provide dictionary with valid user data"""
    sample_uuid = uuid.uuid4()
    yield {"uuid": sample_uuid, "firstName": "Joe", "lastName": "John"}


################################
# User Model
################################


def test_timestamp_user(app, sampleUser):
    """User records should automatically include a timestamp"""
    user = User(**sampleUser)

    db.session.add(user)
    db.session.commit()
    assert user.created_at is not None, "No timestamp created"


def test_non_nullable_uuid(app, sampleUser):
    """UUID must be present"""
    del sampleUser["uuid"]
    user = User(**sampleUser)
    db.session.add(user)
    with pytest.raises(IntegrityError):
        db.session.commit()


def test_uuid_is_uuid(app, sampleUser):
    """Non UUID types should not be valid"""
    sampleUser["uuid"] = "asdfasdfasdf"
    user = User(**sampleUser)
    db.session.add(user)
    with pytest.raises(DataError):
        db.session.commit()


def test_unique_uuid(app, sampleUser):
    """UUID name must be unique"""
    user1 = User(**sampleUser)
    user2 = User(**sampleUser)

    db.session.add_all([user1, user2])
    with pytest.raises(IntegrityError):
        db.session.commit()


def test_non_nullable_first(app, sampleUser):
    """First name should be non nullable"""
    del sampleUser["firstName"]
    user = User(**sampleUser)
    db.session.add(user)
    with pytest.raises(IntegrityError):
        db.session.commit()


def test_empty_first(app, sampleUser):
    """First name must not be empty string"""
    sampleUser["firstName"] = ""
    with pytest.raises(ValueError):
        user = User(**sampleUser)
        db.session.add(user)
        db.session.commit()


@pytest.mark.parametrize("exampleName", ["1", "@", "."])
def test_alpha_first(app, sampleUser, exampleName):
    """First name must only contain a-z A-Z"""
    sampleUser["firstName"] = exampleName
    with pytest.raises(ValueError):
        user = User(**sampleUser)
        db.session.add(user)
        db.session.commit()


def test_max_length_first_name(app, sampleUser):
    """First name should adhere to a maximum length of 20 characters"""
    sampleUser["firstName"] = "a" * 21
    user = User(**sampleUser)
    db.session.add(user)
    with pytest.raises(DataError):
        db.session.commit()


@pytest.mark.parametrize("exampleName", ["john", "John", "JOHN", "jOHN"])
def test_title_case_first_name(app, sampleUser, exampleName):
    """First name should be made title case"""
    sampleUser["firstName"] = exampleName
    user = User(**sampleUser)
    db.session.add(user)
    db.session.commit()
    assert user.firstName == "John", "First name not title case"


def test_non_nullable_last(app, sampleUser):
    """Last name should be non nullable"""
    del sampleUser["lastName"]
    user = User(**sampleUser)
    db.session.add(user)
    with pytest.raises(IntegrityError):
        db.session.commit()


def test_empty_last(app, sampleUser):
    """Last name must not be empty string"""
    sampleUser["lastName"] = ""
    with pytest.raises(ValueError):
        user = User(**sampleUser)
        db.session.add(user)
        db.session.commit()


@pytest.mark.parametrize("exampleName", ["1", "@", "."])
def test_alpha_last(app, sampleUser, exampleName):
    """Last name must only contain a-z A-Z"""
    sampleUser["lastName"] = exampleName
    with pytest.raises(ValueError):
        user = User(**sampleUser)
        db.session.add(user)
        db.session.commit()


def test_max_length_last_name(app, sampleUser):
    """Last name should adhere to a maximum length of 20 characters"""
    sampleUser["lastName"] = "a" * 21
    user = User(**sampleUser)
    db.session.add(user)
    with pytest.raises(DataError):
        db.session.commit()


@pytest.mark.parametrize("exampleName", ["john", "John", "JOHN", "jOHN"])
def test_title_case_last_name(app, sampleUser, exampleName):
    """Last name should be made title case"""
    sampleUser["lastName"] = exampleName
    user = User(**sampleUser)
    db.session.add(user)
    db.session.commit()
    assert user.lastName == "John", "Last name not title case"
