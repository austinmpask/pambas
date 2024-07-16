from sqlalchemy.schema import Column
from sqlalchemy import CheckConstraint
from sqlalchemy.types import (
    String,
    Integer,
    Float,
    DateTime,
    UUID,
    ARRAY,
)
from sqlalchemy.orm import relationship, validates

from datetime import datetime
from flaskr.config import DataFields
from flaskr.validators import Validators
from .base import Base


# Projects are associated with a user by UUID.
# Projects have multiple sections, which have multiple line items, which have multiple pending items
class Project(Base):
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
        "Section",
        backref="project",
        cascade="all, delete-orphan",
        order_by="Section.section_number",
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
            f"length(title) >= {DataFields.PROJECT_TITLE_MIN_LENGTH} AND length(title) <= {DataFields.PROJECT_TITLE_MAX_LENGTH} AND title ~* '^[A-Za-z0-9 ]+$'",
            name="check_title",
        ),
        CheckConstraint(
            f"{DataFields.BUDGET_MIN} <= budget AND budget <= {DataFields.BUDGET_MAX}",
            name="check_budget",
        ),
        CheckConstraint(
            f"{DataFields.BILLED_MIN} <= billed AND billed <= {DataFields.BILLED_MAX}",
            name="check_billed",
        ),
        CheckConstraint(
            f"length(project_manager) >= {DataFields.FULL_NAME_MIN_LENGTH} AND length(project_manager) <= {DataFields.FULL_NAME_MAX_LENGTH} AND project_manager ~* '^[A-Za-z ]+$'",
            name="check_project_manager",
        ),
        CheckConstraint(
            f"length(project_type) >= {DataFields.PROJECT_TYPE_MIN_LENGTH} AND length(project_type) <= {DataFields.PROJECT_TYPE_MAX_LENGTH}",
            name="check_project_type",
        ),
        CheckConstraint(
            f"array_length(checkbox_headers, 1) = {DataFields.NUM_CHECKBOX}",
            name="check_checkbox_headers",
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

        # Calculate a total completion score based on all line items
        completed = 0
        total = 0

        for section in self.sections:
            for line in section.line_items:
                (cAdd, tAdd) = line.progress()
                completed += cAdd
                total += tAdd

        return {
            "id": self.id,
            "title": self.title,
            "budget": self.budget,
            "billed": self.billed,
            "projectManager": self.project_manager,
            "projectType": self.project_type,
            "checkBoxHeaders": self.checkbox_headers,
            "completed": completed,
            "total": total,
        }
