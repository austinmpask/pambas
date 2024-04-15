from sqlalchemy.schema import Column, ForeignKey
from sqlalchemy.types import String, Integer, DateTime, Date, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

genStringLen = 60
hashLen = 60
emailLen = 100
usernameLen = 20


class Domain(db.Model):
    __tablename__ = "domains"
    id = Column(Integer, primary_key=True)
    domain_name = Column(String(genStringLen))
    created_at = Column(DateTime, server_default=func.now())

    users = relationship("User", back_populates="domain")

    def toDict(self):
        return {self.domain_name: {"created_at": self.created_at}}


class User(db.Model):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    user_name = Column(String(usernameLen))
    email = Column(String(emailLen))
    password_hash = Column(String(hashLen))
    created_at = Column(DateTime, server_default=func.now())

    domain_id = Column(Integer, ForeignKey("domains.id"))
    domain = relationship("Domain", back_populates="users")

    projects = relationship("UserProject", back_populates="user")


class ProjectType(db.Model):
    __tablename__ = "project_types"
    id = Column(Integer, primary_key=True)
    project_type = Column(String(genStringLen))


class UserProject(db.Model):
    __tablename__ = "user_projects"
    id = Column(Integer, primary_key=True)
    user_project_name = Column(String(genStringLen))
    user_project_issuance = Column(Date)
    user_project_budget = Column(Integer)
    user_project_billed = Column(Integer)
    created_at = Column(DateTime)

    project_type_id = Column(Integer, ForeignKey("project_types.id"))

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="projects")

    sections = relationship("ProjectSection", back_populates="user_project")


class SectionType(db.Model):
    __tablename__ = "section_types"
    id = Column(Integer, primary_key=True)
    section_type = Column(String(genStringLen))
    default_section_number = Column(Integer)


class ProjectSection(db.Model):
    __tablename__ = "project_sections"
    id = Column(Integer, primary_key=True)
    section_number = Column(Integer)
    custom_section_type = Column(String(genStringLen))

    created_at = Column(DateTime)

    section_type_id = Column(Integer, ForeignKey("section_types.id"))

    user_project_id = Column(Integer, ForeignKey("user_projects.id"))
    user_project = relationship("UserProject", back_populates="sections")

    line_items = relationship("LineItem", back_populates="project_section")


class LineItem(db.Model):
    __tablename__ = "line_items"
    id = Column(Integer, primary_key=True)
    flag = Column(Boolean)
    item = Column(String(genStringLen))  # to be updated
    created_at = Column(DateTime)

    project_section_id = Column(Integer, ForeignKey("project_sections.id"))
    project_section = relationship("ProjectSection", back_populates="line_items")
