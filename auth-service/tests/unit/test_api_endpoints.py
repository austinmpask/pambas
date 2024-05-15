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
    yield {
        "username": "joe101",
        "email": "joejohn101@gmail.com",
        "password": "password",
    }


################################
# /register
################################


def test_no_json_request_post(client):
    """If body is not JSON, an appropriate error should be raised"""
    response = client.post("/register", data="not JSON", content_type="text/plain")
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Must be JSON request"


@pytest.mark.parametrize("attribute", ["username", "email", "password"])
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
    assert responseJson["message"] == "Missing username/email/password"


@pytest.mark.parametrize("attribute", ["username", "email", "password"])
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
    assert responseJson["message"] == "Missing username/email/password"


def test_valid_addition(client, validRegistrationData):
    """If valid request body is posted, the response should indicate success,
    and the new UUID should be included in the response"""
    response = client.post("/register", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 201, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 201
    assert responseJson["status"] == "Success"
    assert responseJson["message"]  # Valid UUID is tested by test_models


################################
# /shallowdelete
################################


def test_no_json_request_delete(client):
    """If body is not JSON, an appropriate error should be raised"""
    response = client.delete(
        "/shallowdelete", data="not JSON", content_type="text/plain"
    )
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Must be JSON request"


@pytest.mark.parametrize("sampleUUID", ["", "asdfasdf"])
def test_valid_uuid(client, sampleUUID):
    """If UUID is invalid, an appropriate error should be raised"""

    response = client.delete("/shallowdelete", json={"uuid": sampleUUID})
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Invalid UUID"


def test_none_uuid(client):
    """If UUID is not provided, an appropriate error should be raised"""

    response = client.delete("/shallowdelete", json={})
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Invalid UUID"
