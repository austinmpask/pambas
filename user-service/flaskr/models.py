from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import validates
from sqlalchemy.schema import Column
from sqlalchemy.types import UUID, Boolean, DateTime, Integer, String

from flaskr.config import DataFields
from flaskr.validators import Validators

# Init sqlalchemy
db = SQLAlchemy()


# Profile related user info
class User(db.Model):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    # Link to auth service DB = UUID
    uuid = Column(UUID(as_uuid=True), unique=True, nullable=False)
    first_name = Column(String(DataFields.FIRST_NAME_MAX_LENGTH), nullable=False)
    last_name = Column(String(DataFields.LAST_NAME_MAX_LENGTH), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now())

    # Settings

    # Bools
    tooltips = Column(Boolean, nullable=False, default=True)
    # useDefaultManager = Column(Boolean, nullable=False, default=False)
    completeProgress = Column(Boolean, nullable=False, default=False)
    highContrast = Column(Boolean, nullable=False, default=False)

    # Ints
    rowHeightPreset = Column(Integer, nullable=False, default=1)
    rowExpandedPreset = Column(Integer, nullable=False, default=1)
    defaultProjectType = Column(Integer, nullable=False, default=3)
    defaultProjectTheme = Column(Integer, nullable=False, default=2)
    tooltipDelay = Column(Integer, nullable=False, default=2)
    # defaultManagerName = Column(String(DataFields.FIRST_NAME_MAX_LENGTH), nullable=True)

    # ----- Validators ----- #

    @validates("uuid")
    def valUUID(self, _key, val):
        return Validators.userUUID(val)

    @validates("first_name")
    def valFirst(self, _key, val):
        return Validators.firstName(val)

    @validates("tooltips", "completeProgress", "highContrast")
    def valBools(self, _key, val):
        return Validators.boolSetting(val)

    # @validates("defaultManagerName")
    # def valManager(self, _key, val):
    #     return Validators.managerName(val)

    @validates("rowHeightPreset")
    def valRowHeightPreset(self, _key, val):
        return Validators.preset(val, DataFields.PRESET_ROW_HEIGHT_MAX)

    @validates("rowExpandedPreset")
    def valRowExpandedPreset(self, _key, val):
        return Validators.preset(val, DataFields.PRESET_ROW_EXPANDED_MAX)

    @validates("defaultProjectType")
    def valDefaultProjectType(self, _key, val):
        return Validators.preset(val, DataFields.PRESET_DEFAULT_PROJ_MAX)

    @validates("defaultProjectTheme")
    def valDefaultProjectTheme(self, _key, val):
        return Validators.preset(val, DataFields.PRESET_DEFAULT_THEME_MAX)

    @validates("tooltipDelay")
    def valTooltipDelay(self, _key, val):
        return Validators.preset(val, DataFields.PRESET_TOOLTIP_MAX)

    # ----- Constraints ----- #

    __table_args__ = (
        CheckConstraint(
            f"length(first_name) >= {DataFields.FIRST_NAME_MIN_LENGTH} AND length(first_name) <= {DataFields.FIRST_NAME_MAX_LENGTH} AND first_name ~* '^[A-Za-z ]+$'",
            name="check_first_name",
        ),
        CheckConstraint(
            f"length(last_name) >= {DataFields.LAST_NAME_MIN_LENGTH} AND length(last_name) <= {DataFields.LAST_NAME_MAX_LENGTH} AND last_name ~* '^[A-Za-z ]+$'",
            name="check_last_name",
        ),
        # CheckConstraint(
        #     f"length(defaultManagerName) >= {DataFields.MANAGER_NAME_MIN} AND length(defaultManagerName) <= {DataFields.MANAGER_NAME_MAX} AND defaultManagerName ~* '^[A-Za-z ]+$'",
        #     name="check_defaultManagerName",
        # ),
        CheckConstraint(
            f"rowHeightPreset >= {DataFields.PRESET_MIN} AND rowHeightPreset <= {DataFields.PRESET_ROW_HEIGHT_MAX}",
            name="check_row_height_preset",
        ),
        CheckConstraint(
            f"rowExpandedPreset >= {DataFields.PRESET_MIN} AND rowExpandedPreset <= {DataFields.PRESET_ROW_EXPANDED_MAX}",
            name="check_row_expanded_preset",
        ),
        CheckConstraint(
            f"defaultProjectType >= {DataFields.PRESET_MIN} AND defaultProjectType <= {DataFields.PRESET_DEFAULT_PROJ_MAX}",
            name="check_default_project_type",
        ),
        CheckConstraint(
            f"defaultProjectTheme >= {DataFields.PRESET_MIN} AND defaultProjectTheme <= {DataFields.PRESET_DEFAULT_THEME_MAX}",
            name="check_default_project_theme",
        ),
        CheckConstraint(
            f"tooltipDelay >= {DataFields.PRESET_MIN} AND tooltipDelay <= {DataFields.PRESET_TOOLTIP_MAX}",
            name="check_tooltip_delay",
        ),
    )

    # ----- Instance Methods ----- #

    # Return user info as a dictionary
    def toDict(self):
        return {
            "uuid": self.uuid,
            "first_name": self.first_name,
            "last_name": self.last_name,
            # "use_default_manager": self.useDefaultManager,
            "tooltips": self.tooltips,
            "complete_progress": self.completeProgress,
            "high_contrast": self.highContrast,
            "row_height_preset": self.rowHeightPreset,
            "row_expanded_preset": self.rowExpandedPreset,
            "default_project_type": self.defaultProjectType,
            "default_project_theme": self.defaultProjectTheme,
            "tooltip_delay": self.tooltipDelay,
            # "default_manager_name": self.defaultManagerName,
        }

    # Return user info as a dictionary without UUID
    def toSafeDict(self):
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
            # "use_default_manager": self.useDefaultManager,
            "tooltips": self.tooltips,
            "complete_progress": self.completeProgress,
            "high_contrast": self.highContrast,
            "row_height_preset": self.rowHeightPreset,
            "row_expanded_preset": self.rowExpandedPreset,
            "default_project_type": self.defaultProjectType,
            "default_project_theme": self.defaultProjectTheme,
            "tooltip_delay": self.tooltipDelay,
            # "default_manager_name": self.defaultManagerName,
        }
