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
        "Section", backref="project", order_by="Section.section_number"
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
    section_number = Column(Integer, nullable=False)

    # FK
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    # Back references
    line_items = relationship("LineItem", backref="section", order_by="LineItem.id")

    # ----- Validators ----- #

    @validates("section_number")
    def valSecNum(self, _key, val):
        return Validators.sectionNumber(val)

    # ----- Constraints ----- #

    __table_args__ = (
        CheckConstraint(
            f'section_number >= {DataFields.SECTION_NUM_MIN} AND section_number <= {DataFields.SECTION_NUM_MAX}',
            name='check_section_number'
        ),
    )

     # ----- Instance Methods ----- #

    # Return dict of section details
    def toDict(self):
        return {
        "id": self.id,
            "projectID": self.project_id,
            "sectionNumber": self.section_number,
            "lineItems": [lineItem.toDict() for lineItem in self.line_items],
        }


class LineItem(db.Model):
    __tablename__ = "line_items"
    id = Column(Integer, primary_key=True)

    flag_marker = Column(Boolean, nullable=False, default=False)
    control_number = Column(String(DataFields.CONTROL_NUM_MAX_LENGTH), default="")

    check_boxes = Column(ARRAY(Integer), nullable=False, default=[0, 0, 0])

    notes = Column(Text, nullable=True, default="")

    # FK
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)

    # Back references
    pending_items = relationship(
        "PendingItem", backref="line_item", order_by="PendingItem.id"
    )

    # ----- Validators ----- #

    @validates("flag_marker")
    def valFlag(self, _key, val):
        return Validators.flagMarker(val)

    @validates("control_number")
    def valContNum(self, _key, val):
        return Validators.controlNumber(val)

    @validates("check_boxes")
    def valCB(self, _key, val):
        return Validators.checkBoxes(val)

    @validates("notes")
    def valNotes(self, _key, val):
        return Validators.notes(val)

    # ----- Constraints ----- #

    __table_args__ = (
        CheckConstraint(
            f'length(control_number) >= {DataFields.CONTROL_NUM_MIN_LENGTH} AND length(control_number) <= {DataFields.CONTROL_NUM_MAX_LENGTH}',
            name='check_control_number_length'
        ),
        CheckConstraint(
            f'array_length(check_boxes, 1) = {DataFields.NUM_CHECKBOX}',
            name='check_check_boxes_length'
        ),
        CheckConstraint(
            f'length(notes) >= {DataFields.NOTES_MIN_LENGTH} AND length(notes) <= {DataFields.NOTES_MAX_LENGTH}',
            name='check_notes_length'
        ),
    )

    # ----- Instance Methods ----- #

    # Return a dict of section details
    def toDict(self):
        return {
            "id": self.id,
            "flagMarker": self.flag_marker,
            "controlNumber": self.control_number,
            "checkBoxes": self.check_boxes,
            "notes": self.notes,
            "sectionID": self.section_id,
            "pendingItems": len(self.pending_items),
        }

    # Return a dict of PendingItem objects associated with this line item
    def getPendingItems(self):
        return [item.toDict() for item in self.pending_items]


class PendingItem(db.Model):
    __tablename__ = "pending_items"
    id = Column(Integer, primary_key=True)

    item_name = Column(String(DataFields.PENDING_ITEM_NAME_MAX_LENGTH), nullable=False)
    description = Column(
        Text, nullable=True, default=""
    )
    control_owner = Column(
        String(DataFields.FULL_NAME_MAX_LENGTH), nullable=True, default=""
    )
    last_contact_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now())

    # FK
    line_item_id = Column(Integer, ForeignKey("line_items.id"), nullable=False)

    # ----- Validators ----- #

    @validates("item_name")
    def valItemName(self, _key, val):
        return Validators.itemName(val)

    @validates("description")
    def valDesc(self, _key, val):
        return Validators.description(val)

    @validates("control_owner")
    def valContOwner(self, _key, val):
        return Validators.controlOwner(val)

    @validates("last_contact_date")
    def valLastContactDate(self, _key, val):
        return Validators.lastContactDate(val)

    # ----- Constraints ----- #

    __table_args__ = (
        CheckConstraint(
            f'length(item_name) >= {DataFields.PENDING_ITEM_NAME_MIN_LENGTH} AND length(item_name) <= {DataFields.PENDING_ITEM_NAME_MAX_LENGTH} AND item_name ~* \'^[A-Za-z0-9 ]+$\'',
            name='check_item_name'
        ),
        CheckConstraint(
            f'length(description) >= {DataFields.PENDING_ITEM_DESC_MIN_LENGTH} AND length(description) <= {DataFields.PENDING_ITEM_DESC_MAX_LENGTH}',
            name='check_description'
        ),
        CheckConstraint(
            f'length(control_owner) >= {DataFields.FULL_NAME_MIN_LENGTH} AND length(control_owner) <= {DataFields.FULL_NAME_MAX_LENGTH} AND control_owner ~* \'^[A-Za-z ]+$\'',
            name='check_control_owner'
        ),
    )

    # ----- Instance Methods ----- #

    # Return a dict of item details
    def toDict(self):
        return {
            "id": self.id,
            "lineItemID": self.line_item_id,
            "itemName": self.item_name,
            "description": self.description,
            "controlOwner": self.control_owner,
            "lastContactDate": self.last_contact_date,
            "createdAt": self.created_at,
        }
