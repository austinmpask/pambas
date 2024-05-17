import pytest
import uuid
import jwt
from flaskr.models import db, User
from flaskr import createApp
from flask import current_app


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


@pytest.fixture(scope="function")
def registerUser(client, validRegistrationData):
    """Register a user to test login functionality"""
    response = client.post("/register", json=validRegistrationData)
    responseJson = response.get_json()

    # Yield UUID
    yield responseJson["message"]


################################
# /register
################################


# For /register and /login
@pytest.mark.parametrize("endpoint", ["/register", "/login"])
def test_no_json_request_post(client, endpoint):
    """If body is not JSON, an appropriate error should be raised"""
    response = client.post(endpoint, data="not JSON", content_type="text/plain")
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


def test_uuid_no_match(client):
    """If UUID is not found in DB, an appropriate error should be raised"""

    # DB is blank, UUID will not match
    testUUID = uuid.uuid4()

    response = client.delete("/shallowdelete", json={"uuid": testUUID})
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "UUID not found"


def test_valid_shallow_deletion(client, validRegistrationData):
    """If valid request body/UUID is provided, the response should indicate success,
    and the deleted UUID should be included in the response"""

    """This is a test of the API response only, test of database mutation occurs in integration/test_auth_db"""

    # Create a user
    postResponse = client.post("/register", json=validRegistrationData)
    postJson = postResponse.get_json()

    # Get user's UUID
    uuidToDel = postJson["message"]

    # Send request to delete
    delResponse = client.delete("/shallowdelete", json={"uuid": uuidToDel})
    responseJson = delResponse.get_json()

    assert delResponse.status_code == 200, "Incorrect response status"

    # Standardized JSON response expected with detail
    assert responseJson["code"] == 200
    assert responseJson["status"] == "Success"
    assert responseJson["message"] == uuidToDel


################################
# /login
################################
def test_missing_login_credentials(client, validRegistrationData):
    """If neither a username or email is provided in the request,
    an appropriate error should be raised"""
    del validRegistrationData["email"]
    del validRegistrationData["username"]

    response = client.post("/login", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Login credential missing"


def test_blank_login_credentials(client, validRegistrationData):
    """If both the username or email provided in the request is "",
    an appropriate error should be raised"""
    validRegistrationData["email"] = ""
    validRegistrationData["username"] = ""

    response = client.post("/login", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Login credential missing"


def test_missing_login_password(client, validRegistrationData):
    """If password is missing from the request,
    an appropriate error should be raised"""
    del validRegistrationData["password"]

    response = client.post("/login", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Password missing"


def test_blank_login_password(client, validRegistrationData):
    """If password is "" in the request,
    an appropriate error should be raised"""
    validRegistrationData["password"] = ""

    response = client.post("/login", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Password missing"


@pytest.mark.parametrize("credential", ["email", "username"])
def test_single_login_credential_undefined(
    client, registerUser, validRegistrationData, credential
):
    """If the one credential (username/email) is not submitted (None),
    but the other is valid, the valid credential is used to authenticate"""

    del validRegistrationData[credential]

    response = client.post("/login", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 200, "Incorrect response status"

    assert responseJson["code"] == 200
    assert responseJson["status"] == "Success"
    assert responseJson["message"]  # JWT token


def test_login_credential_not_found(client, registerUser, validRegistrationData):
    """If the username/email is incorrect/not found,
    the response should be 401 Unauthorized"""

    # Invaliate login credentials
    validRegistrationData["email"] = "incorrectcredential"
    validRegistrationData["username"] = "incorrectcredential"

    response = client.post("/login", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 401, "Incorrect response status"

    assert responseJson["code"] == 401
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Unauthorized: Incorrect login"


def test_login_incorrect_password(client, registerUser, validRegistrationData):
    """If the password is incorrect,
    the response should be 401 Unauthorized"""

    # Invaliate login credentials
    validRegistrationData["password"] = "incorrectpassword"

    response = client.post("/login", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 401, "Incorrect response status"

    assert responseJson["code"] == 401
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Unauthorized: Incorrect login"


@pytest.mark.parametrize("credential", ["email", "username"])
def test_single_login_credential_blank(
    client, registerUser, validRegistrationData, credential
):
    """If the one credential (username/email) is "",
    but the other is valid, the valid credential is used to authenticate"""

    validRegistrationData[credential] = ""

    response = client.post("/login", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 200, "Incorrect response status"

    assert responseJson["code"] == 200
    assert responseJson["status"] == "Success"
    assert responseJson["message"]  # JWT token


def test_both_login_credentials_success(client, registerUser, validRegistrationData):
    """If correct username + email (both credentials) and password is submitted,
    a JWT token is generated and returned. Email is the default credential used"""

    response = client.post("/login", json=validRegistrationData)
    responseJson = response.get_json()

    # Collect UUID from JWT
    responseUUID = jwt.decode(
        responseJson["message"], current_app.config["SECRET_KEY"], algorithms="HS256"
    )

    assert response.status_code == 200, "Incorrect response status"

    assert responseJson["code"] == 200
    assert responseJson["status"] == "Success"
    # Match JWT UUID with user UUID from registration
    assert responseUUID["uuid"] == registerUser


@pytest.mark.parametrize("invalidEmail", ["asdf", "@.", "$$$$$", "asdf@asdf"])
def test_invalid_email_format(
    client, registerUser, validRegistrationData, invalidEmail
):
    """If an invalid email address format is provided,
    among no other valid credential, an appropriate error should be raised"""

    validRegistrationData["email"] = invalidEmail
    del validRegistrationData["username"]

    response = client.post("/login", json=validRegistrationData)
    responseJson = response.get_json()

    assert response.status_code == 400, "Incorrect response status"

    assert responseJson["code"] == 400
    assert responseJson["status"] == "Error"
    assert responseJson["message"] == "Auth DB query error"
