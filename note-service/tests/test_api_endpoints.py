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


@pytest.fixture(scope="function")
def projectData():
    """Provide valid data to create a new project,
    as it would be sent from the gateway"""

    user_uuid = uuid.uuid4()
    sections = [
        {"section": "1", "controls": "4"},
        {"section": "2", "controls": "5"},
        {"section": "3", "controls": "6"},
    ]

    yield {
        "uuid": user_uuid,
        "name": "example company",
        "type": 1,
        "manager": "bossman",
        "sections": sections,
        "budget": 60,
    }


################################
# POST /project
################################


def test_valid_project_creation(client, projectData):
    response = client.post("/project", json=projectData)
    responseJson = response.get_json()

    assert response.status_code == 201, "Incorrect response status"

    assert responseJson["code"] == 201
    assert responseJson["status"] == "Success"
    assert responseJson["message"] == "Project added"
