from sqlalchemy.schema import Column, ForeignKey
from sqlalchemy import CheckConstraint
from sqlalchemy.types import (
    String,
    Integer,
    Float,
    Text,
    DateTime,
    Boolean,
    UUID,
    ARRAY,
)
from sqlalchemy.orm import relationship, validates
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flaskr.config import DataFields
from flaskr.validators import Validators

# Init sqlalchemy
db = SQLAlchemy()


# Projects are associated with a user by UUID.
# Projects have multiple sections, which have multiple line items, which have multiple pending items
class Project(db.Model):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    uuid = Column(UUID(as_uuid=True), nullable=False)
    title = Column(String(DataFields.PROJECT_TITLE_MAX_LENGTH), nullable=False)
    budget = Column(Float, nullable=False)
    billed = Column(Float, nullable=False, default=0)
    project_manager = Column(String(DataFields.FULL_NAME_MAX_LENGTH), nullable=False)
    project_type = Column(String(DataFields.PROJECT_TYPE_MAX_LENGTH), nullable=False)
    checkbox_headers = Column(
        ARRAY(String(DataFields.HEADER_MAX_LENGTH)),
        nullable=False,
        default=["Prep", "Inquiry", "Inspection"],
    )

    created_at = Column(DateTime, nullable=False, default=datetime.now())

    # Back references
    sections = relationship(
        "Section", backref="project", order_by="Section.sectionNumber"
    )

    # ----- Validators ----- #
    @validates("uuid")
    def valUUID(self, _key, val):
        return Validators.userUUID(val)

    @validates("title")
    def valTitle(self, _key, val):
        return Validators.projectTitle(val)

    @validates("budget")
    def valBudget(self, _key, val):
        return Validators.budget(val)

    @validates("billed")
    def valBilled(self, _key, val):
        return Validators.billed(val)

    @validates("project_manager")
    def varManager(self, _key, val):
        return Validators.projectManager(val)

    @validates("project_type")
    def varProjectType(self, _key, val):
        return Validators.projectType(val)

    @validates("checkbox_headers")
    def varCheckHeaders(self, _key, val):
        return Validators.checkboxHeaders(val)
    
    # ----- Constraints ----- #

    __table_args__ = (
        CheckConstraint(
            f'length(title) >= {DataFields.PROJECT_TITLE_MIN_LENGTH} AND length(title) <= {DataFields.PROJECT_TITLE_MAX_LENGTH} AND title ~* \'^[A-Za-z0-9]+$\'',
            name='check_title'
        ),
        CheckConstraint(
            f'{DataFields.BUDGET_MIN} <= budget AND budget <= {DataFields.BUDGET_MAX}',
            name='check_budget'
        ),
        CheckConstraint(
            f'{DataFields.BILLED_MIN} <= billed AND billed <= {DataFields.BILLED_MAX}',
            name='check_billed'
        ),
        CheckConstraint(
            f'length(project_manager) >= {DataFields.FULL_NAME_MIN_LENGTH} AND length(project_manager) <= {DataFields.FULL_NAME_MAX_LENGTH} AND project_manager ~* \'^[A-Za-z ]+$\'',
            name='check_project_manager'
        ),
        CheckConstraint(
            f'length(project_type) >= {DataFields.PROJECT_TYPE_MIN_LENGTH} AND length(project_type) <= {DataFields.PROJECT_TYPE_MAX_LENGTH} AND project_type IN ({",".join(["\'" + pt + "\'" for pt in DataFields.PROJECT_TYPES])})',
            name='check_project_type'
        ),
        CheckConstraint(
            f'array_length(checkbox_headers, 1) = {DataFields.NUM_CHECKBOX}',
            name='check_checkbox_headers'
        ),
    )

    # ----- Instance Methods ----- #

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
            "projectManager": self.project_manager,
            "projectType": self.project_type,
            "checkBoxHeaders": self.checkbox_headers,
        }


class Section(db.Model):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True)
    sectionNumber = Column(Integer, nullable=False)

    # FK
    projectID = Column(Integer, ForeignKey("projects.id"), nullable=False)

    # Back references
    lineItems = relationship("LineItem", backref="section", order_by="LineItem.id")

    # ----- Validators ----- #

    @validates("sectionNumber")
    def valSecNum(self, _key, val):
        return Validators.sectionNumber(val)

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
    controlNumber = Column(String(DataFields.CONTROL_NUM_MAX_LENGTH), default="")

    checkBoxes = Column(ARRAY(Integer), nullable=False, default=[0, 0, 0])

    notes = Column(Text, nullable=True, default="")

    # FK
    sectionID = Column(Integer, ForeignKey("sections.id"), nullable=False)

    # Back references
    pendingItems = relationship(
        "PendingItem", backref="lineItem", order_by="PendingItem.id"
    )

    # ----- Validators ----- #

    @validates("flagMarker")
    def valFlag(self, _key, val):
        return Validators.flagMarker(val)

    @validates("controlNumber")
    def valContNum(self, _key, val):
        return Validators.controlNumber(val)

    @validates("checkBoxes")
    def valCB(self, _key, val):
        return Validators.checkBoxes(val)

    @validates("notes")
    def valNotes(self, _key, val):
        return Validators.notes(val)

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
        return [item.toDict() for item in self.pendingItems]


class PendingItem(db.Model):
    __tablename__ = "pending_items"
    id = Column(Integer, primary_key=True)

    itemName = Column(String(DataFields.PENDING_ITEM_NAME_MAX_LENGTH), nullable=False)
    description = Column(
        Text, nullable=True, default=""
    )
    controlOwner = Column(
        String(DataFields.FULL_NAME_MAX_LENGTH), nullable=True, default=""
    )
    lastContactDate = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now())

    # FK
    lineItemID = Column(Integer, ForeignKey("line_items.id"), nullable=False)

    # ----- Validators ----- #

    @validates("itemName")
    def valItemName(self, _key, val):
        return Validators.itemName(val)

    @validates("description")
    def valDesc(self, _key, val):
        return Validators.description(val)

    @validates("controlOwner")
    def valContOwner(self, _key, val):
        return Validators.controlOwner(val)

    @validates("lastContactDate")
    def valLastContactDate(self, _key, val):
        return Validators.lastContactDate(val)

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
