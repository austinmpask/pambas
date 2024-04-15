from flask import Blueprint
from flaskr.models import db, Domain

test_bp = Blueprint("test", __name__)


@test_bp.route("/test-domain")
def main():
    stuff = db.session.query(Domain).all()
    return [thing.toDict() for thing in stuff]
