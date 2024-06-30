from sqlalchemy.schema import Column
from sqlalchemy import CheckConstraint
from sqlalchemy.types import String, Integer, DateTime, UUID
from sqlalchemy.orm import validates
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flaskr.validators import Validators
from flaskr.config import DataFields

# Init sqlalchemy
db = SQLAlchemy()


# Profile related user info
class User(db.Model):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    # Link to auth service DB = UUID
    uuid = Column(UUID(as_uuid=True), unique=True, nullable=False)
    first_name = Column(String(DataFields.FIRST_NAME_MAX_LENGTH), nullable=False)
    last_name = Column(String(DataFields.LAST_NAME_MAX_LENGTH), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now())

    # ----- Validators ----- #

    @validates("uuid")
    def valUUID(self, _key, val):
        return Validators.userUUID(val)

    @validates("first_name")
    def valFirst(self, _key, val):
        return Validators.firstName(val)

    @validates("last_name")
    def valLast(self, _key, val):
        return Validators.lastName(val)

    # ----- Constraints ----- #

    __table_args__ = (
        CheckConstraint(
            f"length(first_name) >= {DataFields.FIRST_NAME_MIN_LENGTH} AND length(first_name) <= {DataFields.FIRST_NAME_MAX_LENGTH} AND first_name ~* '^[A-Za-z ]+$'",
            name="check_first_name",
        ),
        CheckConstraint(
            f"length(last_name) >= {DataFields.LAST_NAME_MIN_LENGTH} AND length(last_name) <= {DataFields.LAST_NAME_MAX_LENGTH} AND last_name ~* '^[A-Za-z ]+$'",
            name="check_last_name",
        ),
    )

    # ----- Instance Methods ----- #

    # Return user info as a dictionary
    def toDict(self):
        return {
            "uuid": self.uuid,
            "first_name": self.first_name,
            "last_name": self.last_name,
        }

    # Return user info as a dictionary without UUID
    def toSafeDict(self):
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
        }
