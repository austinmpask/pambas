import pytest
from flaskr.models import db, Domain, User
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
    """Create and commit valid domain"""
    domain = Domain(domain_name="Example domain")

    db.session.add(domain)
    db.session.commit()

    """Provide dictionary with valid user data"""
    yield {
        "user_name": "username",
        "email": "email@website.com",
        "password_hash": "xxxxxxxxxxxx",
        "domain_id": domain.id,
    }

    db.session.rollback()


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


@pytest.mark.parametrize(
    "invalid_email",
    [
        "invalid",
        "",
        "email@gmailcom",
        "@gmail.com",
        "gmail.com",
        "@.",
        "skdjfhskdjhfsjkdhfksjfhsdjkhfdskjfhsdjfhsjfdhk",
        ".@",
        "joe@mail.c",
    ],
)
def test_valid_email(app, sample_user, invalid_email):
    """Emails recorded must be valid"""
    sample_user["email"] = invalid_email

    with pytest.raises(ValueError):
        user = User(**sample_user)


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
    sample_user["email"] = "a" * 100 + "@gmail.com"
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
