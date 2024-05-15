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


################################
# /register
################################


def test_no_json_request(client):
    """If body is not JSON, an appropriate error should be raised"""
    response = client.post("/register", data="not JSON", content_type="text/plain")
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Must be JSON request"


@pytest.mark.parametrize("sampleUUID", ["", "asdfasdf"])
def test_valid_uuid(client, validRegistrationData, sampleUUID):
    """If UUID is invalid, an appropriate error should be raised"""

    # Invalidate UUID
    validRegistrationData["uuid"] = sampleUUID

    response = client.post("/register", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Invalid UUID"


def test_none_uuid(client, validRegistrationData):
    """If UUID is not provided, an appropriate error should be raised"""

    # Delete UUID
    del validRegistrationData["uuid"]

    response = client.post("/register", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Invalid UUID"


@pytest.mark.parametrize("attribute", ["first_name", "last_name"])
def test_required_req_data_none(client, validRegistrationData, attribute):
    """If any of the required data in the request is None, an appropriate error should be raised"""

    # Delete an attribute
    del validRegistrationData[attribute]

    response = client.post("/register", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Missing UUID/firstname/lastname"


@pytest.mark.parametrize("attribute", ["first_name", "last_name"])
def test_required_req_data_blank(client, validRegistrationData, attribute):
    """If any of the required data in the request is empty/"", an appropriate error should be raised"""

    # Invalidate an attribute
    validRegistrationData[attribute] = ""

    response = client.post("/register", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Missing UUID/firstname/lastname"


def test_valid_addition(client, validRegistrationData):
    """If valid request body is posted, the response should indicate success,
    and the new UUID should be included in the response"""
    response = client.post("/register", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 201, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 201
    assert responseJson["status"] == "Success"
    assert responseJson["message"] == str(validRegistrationData["uuid"])
