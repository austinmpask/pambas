from flask import request, Blueprint
from flaskr.config import bcrypt
from flaskr.models import db
from flaskr.util import sendJsonResponse


login_bp = Blueprint("login", __name__)
