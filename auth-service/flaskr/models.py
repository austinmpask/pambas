import uuid
from sqlalchemy.schema import Column
from sqlalchemy import CheckConstraint
from sqlalchemy.types import String, Integer, DateTime, UUID
from sqlalchemy.orm import validates
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flaskr.config import DataFields
from flaskr.validators import Validators

# Init sqlalchemy
db = SQLAlchemy()


# Auth user model will store credentials and UUID. Profile info is handled by user service
class User(db.Model):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    uuid = Column(
        UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False
    )  # Link across services
    user_name = Column(
        String(DataFields.USER_NAME_MAX_LEN), nullable=False, unique=True
    )
    email = Column(String(DataFields.EMAIL_MAX_LEN), nullable=False, unique=True)
    password_hash = Column(String(DataFields.PW_HASH_LEN), nullable=False)
    created_at = Column(DateTime, default=datetime.now(), nullable=False)

    # ----- Validators ----- #

    @validates("user_name")
    def valUser(self, _key, val):
        return Validators.userName(val)

    @validates("email")
    def valEmail(self, _key, val):
        return Validators.email(val)

    # ----- Constraints ----- #

    __table_args__ = (
        CheckConstraint(
            f"length(user_name) >= {DataFields.USER_NAME_MIN_LEN} AND length(user_name) <= {DataFields.USER_NAME_MAX_LEN} AND user_name ~* '^[A-Za-z0-9._]+$'",
            name="check_user_name",
        ),
        CheckConstraint(
            f"length(email) >= {DataFields.EMAIL_MIN_LEN} AND length(email) <= {DataFields.EMAIL_MAX_LEN}",
            name="check_email",
        ),
    )

    # ----- Instance Methods ----- #

    # Return user information, not including password hash
    def toSafeDict(self):
        return {
            "username": self.user_name,
            "email": self.email,
        }
