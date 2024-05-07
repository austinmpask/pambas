from sqlalchemy.schema import Column, ForeignKey
from sqlalchemy.types import String, Integer, DateTime, Date, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, validates
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import re


db = SQLAlchemy()

genStringLen = 60
hashLen = 60
emailLen = 100
usernameLen = 20


class Domain(db.Model):
    __tablename__ = "domains"
    id = Column(Integer, primary_key=True)
    domain_name = Column(String(genStringLen), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.now())

    users = relationship("User", back_populates="domain")

    def toDict(self):
        return {self.domain_name: {"created_at": self.created_at}}


class User(db.Model):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    user_name = Column(String(usernameLen), nullable=False, unique=True)
    email = Column(String(emailLen), nullable=False, unique=True)
    password_hash = Column(String(hashLen), nullable=False)
    created_at = Column(DateTime, default=datetime.now())

    domain_id = Column(Integer, ForeignKey("domains.id"), nullable=False)
    domain = relationship("Domain", back_populates="users")

    projects = relationship("UserProject", back_populates="user")

    # Resuire a valid email address
    @validates("email")
    def validate_email(self, key, value):

        # Specify an error message
        e = "Invalid email!"

        # Basic elimination
        if "@" not in value or "." not in value:
            raise ValueError(e)

        # Regex to define valid characters for email substrings
        localValids = r"[!#$%&\'*+\-./=?^_`{|}~a-zA-Z0-9.]+"
        domainValids = r"^[a-zA-Z0-9-]+$"
        tldValids = r"^[a-zA-Z0-9]{2,}$"

        # Incorrect formatted email check
        atIndex = value.rfind("@")
        dotIndex = value.rfind(".")

        if atIndex > dotIndex:
            raise ValueError(e)

        # Make substrings
        local = value[:atIndex]
        domain = value[atIndex + 1 : dotIndex]
        tld = value[dotIndex + 1 :]

        # Test substrings against respective patterns
        lmatch = re.fullmatch(localValids, local)
        dmatch = re.fullmatch(domainValids, domain)
        tmatch = re.fullmatch(tldValids, tld)

        # If any failed, raise error
        if not (lmatch and dmatch and tmatch):
            raise ValueError(e)

        # Valid email
        return value
