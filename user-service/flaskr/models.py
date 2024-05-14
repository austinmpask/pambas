from sqlalchemy.schema import Column, ForeignKey
from sqlalchemy.types import String, Integer, DateTime, Date, Boolean, UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, validates
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import re


db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    uuid = Column(
        UUID(as_uuid=True), unique=True, nullable=False
    )  # Link to auth service DB
    firstName = Column(String(20), nullable=False)
    lastName = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=datetime.now())

    # Blank strings for names not allowed
    @validates("firstName", "lastName")
    def validate_name_not_empty_and_alpha(self, key, name):
        errors = []

        # Blank name
        if not name:
            errors.append(f"{key.capitalize()} can not be empty!")

        # Ensure no numbers/symbols
        if not bool(re.fullmatch(r"[a-zA-Z]+", name)):
            errors.append(f"{key.capitalize()} must only contain a-z A-Z")

        # Raise any errors
        if len(errors):
            raise ValueError(", ".join(errors))

        # Title case the valid name
        return name.title()
