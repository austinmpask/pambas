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
def sample_user(app):
    """Provide dictionary with valid user data"""
    sample_uuid = uuid.uuid4()
    yield {"uuid": sample_uuid, "firstName": "Joe", "lastName": "John"}


################################
# User Model
################################


def test_timestamp_user(app, sample_user):
    """User records should automatically include a timestamp"""
    user = User(**sample_user)

    db.session.add(user)
    db.session.commit()
    assert user.created_at is not None


def test_uuid_is_uuid(app, sample_user):
    """Non UUID types should not be valid"""
    sample_user["uuid"] = "asdfasdfasdf"
    user = User(**sample_user)
    db.session.add(user)
    with pytest.raises(DataError):
        db.session.commit()


def test_unique_uuid(app, sample_user):
    """UUID name must be unique"""
    user1 = User(**sample_user)
    user2 = User(**sample_user)

    db.session.add_all([user1, user2])
    with pytest.raises(IntegrityError):
        db.session.commit()


def test_non_nullable_first(app, sample_user):
    """First name should be non nullable"""
    del sample_user["firstName"]
    user = User(**sample_user)
    db.session.add(user)
    with pytest.raises(IntegrityError):
        db.session.commit()


def test_non_nullable_last(app, sample_user):
    """Last name should be non nullable"""
    del sample_user["lastName"]
    user = User(**sample_user)
    db.session.add(user)
    with pytest.raises(IntegrityError):
        db.session.commit()


def test_max_length_first_name(app, sample_user):
    """First name should adhere to a maximum length of 20 characters"""
    sample_user["firstName"] = "a" * 21
    user = User(**sample_user)
    db.session.add(user)
    with pytest.raises(DataError):
        db.session.commit()


def test_max_length_last_name(app, sample_user):
    """Last name should adhere to a maximum length of 20 characters"""
    sample_user["lastName"] = "a" * 21
    user = User(**sample_user)
    db.session.add(user)
    with pytest.raises(DataError):
        db.session.commit()
