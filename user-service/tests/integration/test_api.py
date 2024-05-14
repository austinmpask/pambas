import pytest
from flaskr.models import db, User
from flaskr import createApp


@pytest.fixture(scope="module")
def client():
    """Seed data, and yield flask test client"""
    app = createApp()

    with app.app_context():
        db.create_all()

        # 2 Sample users
        user1 = User(
            user_name="Big John",
            email="bigjohn@cowlife.net",
            password_hash="fsjhfdskjfhsk",
        )

        user2 = User(
            user_name="Little Joe",
            email="littlejoe@mouselife.net",
            password_hash="dfsfjkdfhshk",
        )

        users = [user1, user2]

        db.session.add_all(users)
        db.session.commit()

        with app.test_client() as client:
            yield client

        db.session.rollback()


# Pick up here, write api endpoint tests
def test_some_endpoint(client):
    response = client.get("/")
    res = response.data.decode("utf-8")
    assert "rootroute" in res
