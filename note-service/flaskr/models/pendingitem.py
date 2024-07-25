from sqlalchemy.schema import Column, ForeignKey
from sqlalchemy import CheckConstraint
from sqlalchemy.types import (
    String,
    Integer,
    Text,
    DateTime,
)
from sqlalchemy.orm import validates
from datetime import datetime
from flaskr.config import DataFields
from flaskr.validators import Validators
from .base import Base


class PendingItem(Base):
    __tablename__ = "pending_items"
    id = Column(Integer, primary_key=True)

    item_name = Column(String(DataFields.PENDING_ITEM_NAME_MAX_LENGTH), nullable=False)
    description = Column(Text, nullable=False, default="")
    control_owner = Column(
        String(DataFields.FULL_NAME_MAX_LENGTH), nullable=False, default=""
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
            f"length(item_name) >= {DataFields.PENDING_ITEM_NAME_MIN_LENGTH} AND length(item_name) <= {DataFields.PENDING_ITEM_NAME_MAX_LENGTH} AND item_name ~* '^[A-Za-z0-9 ]+$'",
            name="check_item_name",
        ),
        CheckConstraint(
            f"length(description) >= {DataFields.PENDING_ITEM_DESC_MIN_LENGTH} AND length(description) <= {DataFields.PENDING_ITEM_DESC_MAX_LENGTH}",
            name="check_description",
        ),
        CheckConstraint(
            f"length(control_owner) >= {DataFields.CONTROL_OWNER_NAME_MIN_LENGTH} AND length(control_owner) <= {DataFields.FULL_NAME_MAX_LENGTH} AND control_owner ~* '^([A-Za-z ]*)$'",
            name="check_control_owner",
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
