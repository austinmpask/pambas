from sqlalchemy.schema import Column, ForeignKey
from sqlalchemy import CheckConstraint
from sqlalchemy.types import Integer
from sqlalchemy.orm import relationship, validates
from flaskr.config import DataFields
from flaskr.validators import Validators
from .base import Base


class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True)
    section_number = Column(Integer, nullable=False)

    # FK
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    # Back references
    line_items = relationship(
        "LineItem",
        backref="section",
        cascade="all, delete-orphan",
        order_by="LineItem.id",
    )

    # ----- Validators ----- #

    @validates("section_number")
    def valSecNum(self, _key, val):
        return Validators.sectionNumber(val)

    # ----- Constraints ----- #

    __table_args__ = (
        CheckConstraint(
            f"section_number >= {DataFields.SECTION_NUM_MIN} AND section_number <= {DataFields.SECTION_NUM_MAX}",
            name="check_section_number",
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
