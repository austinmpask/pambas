import pytest
import uuid
import bcrypt
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


def test_valid_user_creation(app, sampleUser):
    """A valid user properly exists in the database once created and committed"""
    user = User(**sampleUser)
    db.session.add(user)
    db.session.commit()

    # Attempt to find the user in the DB
    queriedUser = db.session.query(User).filter_by(uuid=user.uuid).first()

    assert queriedUser, "User not in DB"
    assert user.user_name == queriedUser.user_name, "Username not matched"
    assert user.email == queriedUser.email, "Email not matched"
    assert user.password_hash == queriedUser.password_hash, "Password hash not matched"


def test_invalid_user_creation(app, sampleUser):
    """If invalid user information is provided, the database is not changed"""

    # Invalidate the data
    sampleUser["user_name"] = "a" * 200

    # UUID should raise DataError for wrong type
    with pytest.raises(Exception):
        user = User(**sampleUser)
        db.session.add(user)
        db.session.commit()

    db.session.rollback()

    # Verify the DB is unchanged
    queryResults = db.session.query(User).all()

    assert not queryResults, "Database should remain unchanged if invalid user is added"
