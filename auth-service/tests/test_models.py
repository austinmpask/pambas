import pytest
import re
import uuid
import bcrypt
from flaskr.models import db, User
from flaskr import createApp
from sqlalchemy.exc import IntegrityError

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

    pw = b"password123"
    salt = bcrypt.gensalt()
    pwHash = bcrypt.hashpw(pw, salt)

    yield {
        "user_name": "johnny10",
        "email": "johhny100@gmail.com",
        "password_hash": pwHash.decode("utf-8"),
    }


################################
# User Model
################################


def test_timestamp(app, sampleUser):
    """User records should automatically include a timestamp"""
    user = User(**sampleUser)

    db.session.add(user)
    db.session.commit()
    assert user.created_at is not None


def test_UUID(app, sampleUser):
    """User records should be automatically populated with valid UUID"""
    user = User(**sampleUser)

    db.session.add(user)
    db.session.commit()

    assert user.uuid is not None, "No UUID created"
    assert isinstance(user.uuid, uuid.UUID), "UUID field is not valid UUID obj"


def test_non_nullable_username(app, sampleUser):
    """Username can not be null"""
    del sampleUser["user_name"]
    user = User(**sampleUser)
    db.session.add(user)
    with pytest.raises(IntegrityError):
        db.session.commit()


def test_unique_username(app, sampleUser):
    """Username must be unique"""
    user1 = User(**sampleUser)
    sampleUser["email"] = "different@gmail.com"
    user2 = User(**sampleUser)

    db.session.add_all([user1, user2])
    with pytest.raises(IntegrityError):
        db.session.commit()


def test_non_nullable_email(app, sampleUser):
    """Email can not be null"""
    del sampleUser["email"]
    user = User(**sampleUser)
    db.session.add(user)
    with pytest.raises(IntegrityError):
        db.session.commit()


def test_unique_email(app, sampleUser):
    """Email must be unique"""
    user1 = User(**sampleUser)
    sampleUser["user_name"] = "different"
    user2 = User(**sampleUser)

    db.session.add_all([user1, user2])
    with pytest.raises(IntegrityError):
        db.session.commit()


@pytest.mark.parametrize(
    "sampleEmail", ["", "@.", "a@a", "word.word@com", "wor@mail.co!"]
)
def test_valid_email(app, sampleUser, sampleEmail):
    """Email must be valid"""
    sampleUser["email"] = sampleEmail
    with pytest.raises(ValueError):
        user = User(**sampleUser)
        db.session.add(user)
        db.session.commit()


def test_non_nullable_password(app, sampleUser):
    """Password can not be null"""
    del sampleUser["password_hash"]
    user = User(**sampleUser)
    db.session.add(user)
    with pytest.raises(IntegrityError):
        db.session.commit()


def test_hashed_password(app, sampleUser):
    """Password must be hashed"""
    pattern = r"^\$2[aby]?\$[0-9]{2}\$[./A-Za-z0-9]{53}$"

    user = User(**sampleUser)
    db.session.add(user)
    db.session.commit()

    pwHash = user.password_hash

    assert re.match(pattern, pwHash) is not None
