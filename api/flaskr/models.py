from sqlalchemy.schema import Column, ForeignKey
from sqlalchemy.types import String, Integer, DateTime, Date, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


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


class ProjectType(db.Model):
    __tablename__ = "project_types"
    id = Column(Integer, primary_key=True)
    project_type = Column(String(genStringLen), nullable=False, unique=True)


class UserProject(db.Model):
    __tablename__ = "user_projects"
    id = Column(Integer, primary_key=True)
    user_project_name = Column(String(genStringLen), nullable=False)
    user_project_issuance = Column(Date, nullable=False)
    user_project_budget = Column(Integer, nullable=False, default=0)
    user_project_billed = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.now())

    project_type_id = Column(Integer, ForeignKey("project_types.id"), nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="projects")

    sections = relationship("ProjectSection", back_populates="user_project")


class SectionType(db.Model):
    __tablename__ = "section_types"
    id = Column(Integer, primary_key=True)
    section_type = Column(String(genStringLen), nullable=False)
    default_section_number = Column(Integer, nullable=False)


class ProjectSection(db.Model):
    __tablename__ = "project_sections"
    id = Column(Integer, primary_key=True)
    custom_section_number = Column(
        Integer, nullable=False
    )  # FIX, this should be nullable
    custom_section_type = Column(String(genStringLen))

    created_at = Column(DateTime, default=datetime.now())

    section_type_id = Column(Integer, ForeignKey("section_types.id"), nullable=False)

    user_project_id = Column(Integer, ForeignKey("user_projects.id"), nullable=False)
    user_project = relationship("UserProject", back_populates="sections")

    line_items = relationship("LineItem", back_populates="project_section")


class LineItem(db.Model):
    __tablename__ = "line_items"
    id = Column(Integer, primary_key=True)
    flag = Column(Boolean, nullable=False, default=False)
    item = Column(
        String(genStringLen), nullable=False, default=""
    )  # FIX, to be updated
    created_at = Column(DateTime, default=datetime.now())

    project_section_id = Column(
        Integer, ForeignKey("project_sections.id"), nullable=False
    )
    project_section = relationship("ProjectSection", back_populates="line_items")
