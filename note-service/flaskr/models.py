from sqlalchemy.schema import Column, ForeignKey
from sqlalchemy.types import (
    String,
    Integer,
    Text,
    DateTime,
    Boolean,
    UUID,
    ARRAY,
)
from sqlalchemy.orm import relationship, validates
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Init sqlalchemy
db = SQLAlchemy()

# Predefined project types for user selection. Does not change functionality, naming purposes only
projectTypes = {
    1: "SOC 1 Type 1",
    2: "SOC 1 Type 2",
    3: "SOC 2 Type 1",
    4: "SOC 2 Type 2",
    5: "Other",
}

# Field lengths
titleLength = 20
nameLength = 25
typeLength = 15
controlNumLength = 5


# Projects are associated with a user by UUID.
# Projects have multiple sections, which have multiple line items, which have multiple pending items


class Project(db.Model):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    uuid = Column(UUID(as_uuid=True), nullable=False)
    title = Column(String(titleLength), nullable=False)
    budget = Column(Integer, nullable=False)
    billed = Column(Integer, nullable=False, default=0)
    projectManager = Column(String(nameLength), nullable=False)
    projectType = Column(String(typeLength), nullable=False)
    checkboxHeaders = Column(
        ARRAY(String(titleLength)),
        nullable=False,
        default=["Prep", "Inquiry", "Inspection"],
    )

    created_at = Column(DateTime, nullable=False, default=datetime.now())

    # Back references
    sections = relationship(
        "Section", backref="project", order_by="Section.sectionNumber"
    )

    # Return dictionary of project section details
    def toSectionsDict(self):
        return {
            "sections": [section.toDict() for section in self.sections],
        }

    # Return dictionary of project summary details
    def toSummaryDict(self):
        return {
            "id": self.id,
            "title": self.title,
            "budget": self.budget,
            "billed": self.billed,
            "projectManager": self.projectManager,
            "projectType": self.projectType,
            "checkBoxHeaders": self.checkboxHeaders,
        }

    # Titlecase the manager and project name
    @validates("title", "projectManager")
    def titleCase(self, _key, word):
        return word.title()


class Section(db.Model):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True)
    sectionNumber = Column(Integer, nullable=False)

    # FK
    projectID = Column(Integer, ForeignKey("projects.id"), nullable=False)

    # Back references
    lineItems = relationship("LineItem", backref="section", order_by="LineItem.id")

    # Return dict of section details
    def toDict(self):
        return {
            "id": self.id,
            "projectID": self.projectID,
            "sectionNumber": self.sectionNumber,
            "lineItems": [lineItem.toDict() for lineItem in self.lineItems],
        }


class LineItem(db.Model):
    __tablename__ = "line_items"
    id = Column(Integer, primary_key=True)

    flagMarker = Column(Boolean, nullable=False, default=False)
    controlNumber = Column(String(controlNumLength), default="")

    checkBoxes = Column(ARRAY(Integer), nullable=False, default=[0, 0, 0])

    notes = Column(Text, nullable=True, default="")

    # FK
    sectionID = Column(Integer, ForeignKey("sections.id"), nullable=False)

    # Back references
    pendingItems = relationship(
        "PendingItem", backref="lineItem", order_by="PendingItem.id"
    )

    # Return a dict of section details
    def toDict(self):
        return {
            "id": self.id,
            "flagMarker": self.flagMarker,
            "controlNumber": self.controlNumber,
            "checkBoxes": self.checkBoxes,
            "notes": self.notes,
            "sectionID": self.sectionID,
            "pendingItems": len(self.pendingItems),
        }

    # Return a dict of PendingItem objects associated with this line item
    def getPendingItems(self):
        return [item for item in self.pendingItems]


class PendingItem(db.Model):
    __tablename__ = "pending_items"
    id = Column(Integer, primary_key=True)

    itemName = Column(String(titleLength), nullable=False)
    description = Column(Text, nullable=True, default="")
    controlOwner = Column(String(nameLength), nullable=True, default="")
    lastContactDate = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now())

    # FK
    lineItemID = Column(Integer, ForeignKey("line_items.id"), nullable=False)

    # Return a dict of item details
    def toDict(self):
        return {
            "id": self.id,
            "lineItemID": self.lineItemID,
            "itemName": self.itemName,
            "description": self.description,
            "controlOwner": self.controlOwner,
            "lastContactDate": self.lastContactDate,
            "createdAt": self.created_at,
        }
