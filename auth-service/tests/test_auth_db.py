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
def client(app):
    """Fixture to yield client to create requests"""
    with app.test_client() as client:
        yield client


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


def test_valid_user_shallow_delete(client, sampleUser):
    """If a valid user is deleted using /shallowdelete,
    the database reflects the change"""

    # Add a valid user to the blank DB
    user = User(**sampleUser)
    db.session.add(user)
    db.session.commit()

    # Ensure that there is a user in the DB
    initQuery = db.session.query(User).all()
    assert len(initQuery) == 1

    sampleUUID = user.uuid

    # Attempt to remove from DB via /shallowdelete endpoint
    response = client.delete("/shallowdelete", json={"uuid": sampleUUID})

    # Check response OK, check that the DB is empty again

    assert response.status_code == 200, "API response not OK"
    secondQuery = db.session.query(User).all()
    assert not secondQuery, "User still exists in DB after deletion"


@pytest.mark.parametrize("invalidUUID", ["asdfasdf", uuid.uuid4()])
def test_invalid_user_shallow_delete(client, sampleUser, invalidUUID):
    """If an invalid or non-existant UUID is provided to /shallowdelete,
    the database remains unchanged"""

    # Add a valid user to the blank DB
    user = User(**sampleUser)
    db.session.add(user)
    db.session.commit()

    # Ensure that there is a user in the DB
    initQuery = db.session.query(User).all()
    assert len(initQuery) == 1

    # Attempt to remove from DB via /shallowdelete endpoint with invalid/nonexistant UUID
    response = client.delete("/shallowdelete", json={"uuid": invalidUUID})

    # Check response not OK, check that the DB is unchanged

    assert (
        response.status_code == 400 or response.status_code == 404
    ), "API response was OK"

    # Compare query results to confirm same contents
    secondQuery = db.session.query(User).all()

    iQSet = {user.uuid for user in initQuery}
    sQSet = {user.uuid for user in secondQuery}

    assert iQSet == sQSet, "User still exists in DB after deletion"
