from flask import Blueprint
from flaskr.models import db, Domain

test_bp = Blueprint("test", __name__)


@test_bp.route("/test-domain")
def main():
    # TEST
    testthing = Domain(domain_name="joseph")
    db.session.add(testthing)
    db.session.commit()

    stuff = db.session.query(Domain).all()
    return [thing.domain_name for thing in stuff]
