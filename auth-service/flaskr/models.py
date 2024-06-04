from sqlalchemy.schema import Column
from sqlalchemy.types import String, Integer, DateTime, UUID
from sqlalchemy.orm import validates
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid
import validators

# Init sqlalchemy
db = SQLAlchemy()

# Field lengths
hashLen = 60
emailLen = 100
usernameLen = 20


class User(db.Model):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    uuid = Column(
        UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False
    )  # Link across services
    user_name = Column(String(usernameLen), nullable=False, unique=True)
    email = Column(String(emailLen), nullable=False, unique=True)
    password_hash = Column(String(hashLen), nullable=False)
    created_at = Column(DateTime, default=datetime.now())

    # Require a valid email address
    @validates("email")
    def validate_email(self, _key, value):

        if validators.email(value):
            return value
        else:
            raise ValueError("Invalid email!")

    # TODO add username validator

    # Instance method to return user information, not including password hash
    def toSafeDict(self):
        return {
            "username": self.user_name,
            "email": self.email,
        }
