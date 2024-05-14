import pytest
import uuid
from flaskr.models import db, User
from flaskr import createApp


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


@pytest.fixture(scope="module")
def validUser():
    """Yields dictionry with valid user data"""
    sample_uuid = uuid.uuid4()
    yield {"uuid": sample_uuid, "firstName": "Joe", "lastName": "John"}


def test_valid_user_creation(app, validUser):
    """A valid user properly exists in the database once created and committed"""
    user = User(**validUser)
    db.session.add(user)
    db.session.commit()

    # Attempt to find the user in the DB
    queriedUser = db.session.query(User).filter_by(uuid=user.uuid).first()

    assert queriedUser, "User not in DB"
    assert user.firstName == queriedUser.firstName, "First name not matched"
    assert user.lastName == queriedUser.lastName, "Last name not matched"


def test_invalid_user_creation(app, validUser):
    """If invalid user information is provided, the database is not changed"""

    # Invalidate the data
    validUser["uuid"] = ""

    # UUID should raise DataError for wrong type
    with pytest.raises(Exception):
        user = User(**validUser)
        db.session.add(user)
        db.session.commit()

    db.session.rollback()

    # Verify the DB is unchanged
    queryResults = db.session.query(User).all()

    assert not queryResults, "Database should remain unchanged if invalid user is added"
