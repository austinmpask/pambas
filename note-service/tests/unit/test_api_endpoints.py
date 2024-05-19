import pytest
import uuid
from flaskr.models import db
from flaskr import createApp


@pytest.fixture(scope="function")
def client():
    """Create a clean app context and yield client to create requests"""
    app = createApp()
    with app.app_context():
        db.create_all()

        with app.test_client() as client:

            yield client

        db.session.rollback()
        db.drop_all()
