from sqlalchemy.schema import Column, ForeignKey
from sqlalchemy import CheckConstraint
from sqlalchemy.types import (
    String,
    Integer,
    Text,
    Boolean,
    ARRAY,
)
from sqlalchemy.orm import relationship, validates
from flaskr.config import DataFields
from flaskr.validators import Validators
from .base import Base


class LineItem(Base):
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
        "PendingItem",
        backref="line_item",
        cascade="all, delete-orphan",
        order_by="PendingItem.id",
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
            f"length(control_number) >= {DataFields.CONTROL_NUM_MIN_LENGTH} AND length(control_number) <= {DataFields.CONTROL_NUM_MAX_LENGTH}",
            name="check_control_number_length",
        ),
        CheckConstraint(
            f"array_length(check_boxes, 1) = {DataFields.NUM_CHECKBOX}",
            name="check_check_boxes_length",
        ),
        CheckConstraint(
            f"length(notes) >= {DataFields.NOTES_MIN_LENGTH} AND length(notes) <= {DataFields.NOTES_MAX_LENGTH}",
            name="check_notes_length",
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
