import pytest
import uuid
from flaskr.models import db, User
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


@pytest.fixture(scope="function")
def validRegistrationData():
    """Yield valid body for registration"""
    sample_uuid = uuid.uuid4()
    yield {"uuid": sample_uuid, "first_name": "Joe", "last_name": "John"}


def test_no_json_request(client):
    """If body is not JSON, an appropriate error should be raised"""
    response = client.post("/register", data="not JSON", content_type="text/plain")

    responseJson = response.get_json()

    assert response.status_code == 400

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Must be JSON request"
