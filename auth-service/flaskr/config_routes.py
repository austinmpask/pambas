from flask import jsonify, request, make_response
from flask_bcrypt import Bcrypt
from .models import db, User
from .util import sendJsonResponse
from flaskr.routes import register, shallowdelete, login
import flaskr.routes
import uuid


def configureRoutes(app):

    with app.app_context():

        # Register blueprints for API endpoints
        app.register_blueprint(flaskr.routes.index_bp)
        app.register_blueprint(register.register_bp)
        app.register_blueprint(login.login_bp)
        app.register_blueprint(shallowdelete.shallowDelete_bp)
