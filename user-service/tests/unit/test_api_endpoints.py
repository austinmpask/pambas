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


@pytest.fixture(scope="function")
def registerUser(client, validRegistrationData):
    """Register a user and then provide UUID"""

    user = User(**validRegistrationData)
    db.session.add(user)
    db.session.commit()

    yield (user, {"uuid": user.uuid})


################################
# /register
################################


# /register and /userdata
@pytest.mark.parametrize("endpoint", ["/register", "/userdata"])
def test_no_json_request(client, endpoint):
    """If body is not JSON, an appropriate error should be raised"""
    response = client.post(endpoint, data="not JSON", content_type="text/plain")
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


################################
# GET /userdata
################################
def test_no_UUID_userdata(client):
    """If UUID key is not provided in request,
    an appropriate error should be raised"""
    response = client.get("/userdata")
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Missing UUID"


@pytest.mark.parametrize("badUUID", ["", "asdfasdf", None])
def test_bad_UUID_userdata(client, badUUID):
    """If UUID is invalid format,
    an appropriate error should be raised"""

    body = {"uuid": badUUID}

    response = client.get("/userdata", json=body)
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Missing UUID"


def test_no_match_UUID_userdata(client, registerUser):
    """If UUID produces no database match,
    an appropriate error should be raised"""

    registerUser[1]["uuid"] = uuid.uuid4()

    response = client.get("/userdata", json=registerUser[1])
    responseJson = response.get_json()

    assert response.status_code == 404, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 404
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "User not found"


def test_match_UUID_userdata(client, registerUser):
    """If UUID matches a database record,
    the record will be returned as JSON"""

    response = client.get("/userdata", json=registerUser[1])
    responseJson = response.get_json()

    user = registerUser[0]

    expectedResponse = {
        "uuid": user.uuid,
        "first_name": user.firstName,
        "last_name": user.lastName,
    }

    assert response.status_code == 200, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 200
    assert responseJson["status"] == "Success"
    assert responseJson["message"] == expectedResponse


################################
# POST /userdata
################################


def test_no_UUID_post_userdata(client):
    """If UUID key is not provided in request,
    an appropriate error should be raised"""
    response = client.post("/userdata")
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Missing UUID"


@pytest.mark.parametrize("badUUID", ["", "asdfasdf", None])
def test_bad_UUID_post_userdata(client, badUUID):
    """If UUID is invalid format,
    an appropriate error should be raised"""

    body = {"uuid": badUUID}

    response = client.post("/userdata", json=body)
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Missing UUID"


def test_no_match_UUID_post_userdata(client, registerUser):
    """If UUID produces no database match,
    an appropriate error should be raised"""

    registerUser[1]["uuid"] = uuid.uuid4()

    response = client.post("/userdata", json=registerUser[1])
    responseJson = response.get_json()

    assert response.status_code == 404, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 404
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "User not found"


def test_no_fields_post_userdata(client, registerUser):
    """If no information is provided with UUID,
    an appropriate error is raised"""

    response = client.post("/userdata", json=registerUser[1])
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Missing attributes"


def test_invalid_key_post_userdata(client, registerUser):
    """If an invalid data key is included in the request,
    an appropriate error should be raised"""

    registerUser[1]["invalidkey"] = "something"
    response = client.post("/userdata", json=registerUser[1])
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Invalid key"


def test_fail_constraint_post_userdata(client, registerUser):
    """If model constraints/validators fail,
    an appropriate error should be raised"""

    # Invalid first name
    registerUser[1]["firstName"] = "$$$"
    response = client.post("/userdata", json=registerUser[1])
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Database constraint/validator error"


@pytest.mark.parametrize("attribute", ["firstName", "lastName"])
def test_valid_single_change_post_userdata(client, registerUser, attribute):
    """If a valid data key with valid data is submitted with valid UUID,
    the response should indicate success"""

    # Replace an attribute
    registerUser[1][attribute] = "newname"

    response = client.post("/userdata", json=registerUser[1])
    responseJson = response.get_json()

    assert response.status_code == 200, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 200
    assert responseJson["status"] == "Success"
    assert responseJson["message"][attribute] == "newname"


def test_valid_double_change_post_userdata(client, registerUser):
    """Endpoint will accept any number of valid keys and update all that are provided,
    so long as they match DB columns"""

    # Replace both currently available attributes, single replacements tested in test_valid_single_change_post_userdata
    registerUser[1]["firstName"] = "newname"
    registerUser[1]["lastName"] = "lastname"

    response = client.post("/userdata", json=registerUser[1])
    responseJson = response.get_json()

    user = registerUser[0]

    expectedResponse = {
        "uuid": user.uuid,
        "first_name": "newname",
        "last_name": "lastname",
    }

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == expectedResponse
