from sqlalchemy.schema import Column, ForeignKey
from sqlalchemy.types import (
    String,
    Integer,
    Numeric,
    Text,
    DateTime,
    Date,
    Boolean,
    UUID,
    Enum,
    ARRAY,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, validates
from sqlalchemy import CheckConstraint
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import re
import enum

db = SQLAlchemy()


class ProjectType(enum.Enum):
    SOC_1_TYPE_1 = "SOC 1 Type 1"
    SOC_1_TYPE_2 = "SOC 1 Type 2"
    SOC_2_TYPE_1 = "SOC 2 Type 1"
    SOC_2_TYPE_2 = "SOC 2 Type 2"
    OTHER = "Other"


class Project(db.Model):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    uuid = Column(UUID(as_uuid=True), nullable=False)
    title = Column(String(20), nullable=False)
    budget = Column(Integer, nullable=False)
    billed = Column(Integer, nullable=False, default=0)
    projectManager = Column(String(25))
    projectType = Column(Enum(ProjectType), nullable=False)
    checkboxHeaders = Column(
        ARRAY(String(20)), nullable=False, default=["Prep", "Inquiry", "Inspection"]
    )

    created_at = Column(DateTime, nullable=False, default=datetime.now())

    # Back references
    sections = relationship("Section", backref="project")


class Section(db.Model):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True)
    sectionNumber = Column(Integer, nullable=False)
    sectionType = Column(
        String(30),
        nullable=True,
    )

    # FK
    projectID = Column(Integer, ForeignKey("projects.id"), nullable=False)

    # Back references
    lineItems = relationship("LineItem", backref="section")


class LineItem(db.Model):
    __tablename__ = "line_items"
    id = Column(Integer, primary_key=True)

    flagMarker = Column(Boolean, nullable=False, default=False)
    controlNumber = Column(Numeric(4, 2), default=0)

    checkBoxes = Column(ARRAY(Integer), nullable=False, default=[0, 0, 0])

    notes = Column(Text, nullable=True, default="")

    # FK
    sectionID = Column(Integer, ForeignKey("sections.id"), nullable=False)

    # Back references
    pendingItems = relationship("PendingItem", backref="lineItem")


class PendingItem(db.Model):
    __tablename__ = "pending_items"
    id = Column(Integer, primary_key=True)

    itemName = Column(String(20), nullable=False)
    description = Column(Text, nullable=True, default="")
    controlOwner = Column(String(25), nullable=True, default="")
    lastContactDate = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now())

    # FK
    lineItemID = Column(Integer, ForeignKey("line_items.id"), nullable=False)
