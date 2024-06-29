from flaskr.config import DataFields
import uuid


# ----- Generic error message builders ----- #


def lengthError(name, minL, maxL):
    return f"{name} length must be between {minL} and {maxL} characters"


def rangeError(name, minR, maxR):
    return f"{name} must be between {minR} and {maxR}"


def noneError(name):
    return f"{name} must not be empty"


def alphaNumError(name):
    return f"{name} must be alphanumeric (a-Z, 0-9)"


def alphaError(name):
    return f"{name} must only contain letters"


def typeError(name, expected):
    return f"{name} must be {expected.__name__} type"


def incrementalError(name, inc):
    return f"Increments of less than {inc} hours are not supported for {name}"


def projTypeError(val):
    return f"'{str(val)}' is not a valid project type"


class Validators:

    # ----- Generic validations ----- #
    @staticmethod
    def validateExists(val, prettyName):
        if val is None:
            raise ValueError(noneError(prettyName))
        return val

    @staticmethod
    def validateType(val, prettyName, expected):
        if not isinstance(val, expected):
            raise TypeError(typeError(prettyName, expected))
        return val

    @staticmethod
    def validateLength(val, prettyName, minL, maxL):
        if not (minL <= len(val) <= maxL):
            raise ValueError(lengthError(prettyName, minL, maxL))
        return val

    @staticmethod
    def validateRange(val, prettyName, minR, maxR):
        if not (minR <= val <= maxR):
            raise ValueError(rangeError(prettyName, minR, maxR))
        return val

    @staticmethod
    def validateAlphaNum(val, prettyName):
        if not val.isalnum():
            raise ValueError(alphaNumError(prettyName))
        return val

    @staticmethod
    def validateAlpha(val, prettyName):
        if not val.isalpha():
            raise ValueError(alphaError(prettyName))
        return val

    @staticmethod
    def validateIncremental(val, prettyName, inc):
        if val % inc != 0:
            raise ValueError(incrementalError(prettyName, inc))
        return val

    @staticmethod
    def validateProjType(val):
        if val not in DataFields.PROJECT_TYPES:
            raise ValueError(projTypeError(val))
        return val

    @staticmethod
    def validateFullName(val, n):
        splitStr = val.split(" ")
        for word in splitStr:
            Validators.validateAlpha(word, n)
        return val

    # @staticmethod
    # def validateUUID(val):
    #     try:
    #         val = uuid.UUID(val)
    #     except (ValueError, TypeError):
    #         raise ValueError("Invalid UUID")
    #     return val

    @staticmethod
    def validateControlNumStr(val):
        # Format is numeric only with ONE "."
        lst = val.split(".")

        if (not all([item.isnumeric() for item in lst])) or len(lst) != 2:
            raise ValueError("Invalid control number format, XX.XX required")
        return val

    # ----- PROJECT MODEL ----- #

    @staticmethod
    def userUUID(val) -> uuid.UUID:
        n = "UUID"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.UUID_TYPE)
        return val

    @staticmethod
    def projectTitle(val) -> str:
        n = "Project Title"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.PROJECT_TITLE_TYPE)
        Validators.validateAlphaNum(val, n)
        Validators.validateLength(
            val,
            n,
            DataFields.PROJECT_TITLE_MIN_LENGTH,
            DataFields.PROJECT_TITLE_MAX_LENGTH,
        )
        return val.strip().title()

    @staticmethod
    def budget(val) -> DataFields.BUDGET_TYPE:
        n = "Budget"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, (int, DataFields.BUDGET_TYPE))
        Validators.validateRange(val, n, DataFields.BUDGET_MIN, DataFields.BUDGET_MAX)
        Validators.validateIncremental(val, n, DataFields.BUDGET_INCREMENTAL)
        return DataFields.BUDGET_TYPE(val)

    @staticmethod
    def billed(val) -> DataFields.BILLED_TYPE:
        n = "Billed Hours"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, (int, DataFields.BILLED_TYPE))
        Validators.validateRange(val, n, DataFields.BILLED_MIN, DataFields.BILLED_MAX)
        Validators.validateIncremental(val, n, DataFields.BILLED_INCREMENTAL)
        return DataFields.BILLED_TYPE(val)

    @staticmethod
    def projectManager(val) -> DataFields.FULL_NAME_TYPE:
        n = "Project Manager"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.FULL_NAME_TYPE)
        Validators.validateFullName(val, n)
        Validators.validateLength(
            val, n, DataFields.FULL_NAME_MIN_LENGTH, DataFields.FULL_NAME_MAX_LENGTH
        )
        return val.strip().title()

    @staticmethod
    def projectType(val) -> DataFields.PROJECT_TYPE_TYPE:
        n = "Project Type"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.PROJECT_TYPE_TYPE)
        Validators.validateLength(
            val,
            n,
            DataFields.PROJECT_TYPE_MIN_LENGTH,
            DataFields.PROJECT_TYPE_MAX_LENGTH,
        )
        Validators.validateProjType(val)

        return val

    @staticmethod
    def checkboxHeaders(val) -> DataFields.CHECKBOX_TYPE:
        n = "Checkbox Headers"
        # Tests

        # Validate that the whole thing is a list
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.CHECKBOX_TYPE)
        Validators.validateLength(
            val, n, DataFields.NUM_CHECKBOX, DataFields.NUM_CHECKBOX
        )

        # Run validations on each of the list elements
        for item in val:
            Validators.validateExists(item, n)
            Validators.validateType(item, n, (int, DataFields.HEADER_TYPE))
            Validators.validateAlphaNum(item, n)
            Validators.validateLength(
                item, n, DataFields.HEADER_MIN_LENGTH, DataFields.HEADER_MAX_LENGTH
            )

        # Sanitize and return
        return [str(item).strip().upper() for item in val]

    # ----- SECTION MODEL ----- #

    @staticmethod
    def sectionNumber(val) -> DataFields.SECTION_NUM_TYPE:
        n = "Section Number"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.SECTION_NUM_TYPE)
        Validators.validateRange(
            val, n, DataFields.SECTION_NUM_MIN, DataFields.SECTION_NUM_MAX
        )

        return DataFields.SECTION_NUM_TYPE(val)

    # ----- LINEITEM MODEL ----- #

    @staticmethod
    def flagMarker(val) -> DataFields.FLAG_TYPE:
        n = "Flag Marker"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.FLAG_TYPE)

        return val

    @staticmethod
    def controlNumber(val) -> DataFields.CONTROL_NUM_TYPE:
        n = "Control Number"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.CONTROL_NUM_TYPE)
        Validators.validateLength(
            val, n, DataFields.CONTROL_NUM_MIN_LENGTH, DataFields.CONTROL_NUM_MAX_LENGTH
        )
        Validators.validateControlNumStr(val)

        return val

    @staticmethod
    def checkBoxes(val) -> DataFields.CHECKBOX_TYPE:
        n = "Checkboxes"
        nChild = "Checkbox Content"
        # Tests

        # First make sure it is a list of right length
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.CHECKBOX_TYPE)
        Validators.validateLength(
            val, n, DataFields.NUM_CHECKBOX, DataFields.NUM_CHECKBOX
        )

        # Validate individual list members
        for number in val:
            Validators.validateExists(number, nChild)
            Validators.validateType(number, nChild, DataFields.CHECKBOX_VAL_TYPE)
            Validators.validateRange(
                number, nChild, DataFields.CHECKBOX_VAL_MIN, DataFields.CHECKBOX_VAL_MAX
            )

        return val

    @staticmethod
    def notes(val) -> DataFields.NOTES_TYPE:
        n = "Notes"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.NOTES_TYPE)
        Validators.validateLength(
            val, n, DataFields.NOTES_MIN_LENGTH, DataFields.NOTES_MAX_LENGTH
        )

        return str(val).strip().capitalize()

    # ----- PENDINGITEM MODEL ----- #

    @staticmethod
    def itemName(val) -> DataFields.PENDING_ITEM_NAME_TYPE:
        n = "Pending Item Name"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.PENDING_ITEM_NAME_TYPE)
        Validators.validateLength(
            val,
            n,
            DataFields.PENDING_ITEM_NAME_MIN_LENGTH,
            DataFields.PENDING_ITEM_NAME_MAX_LENGTH,
        )
        Validators.validateAlphaNum(val, n)

        return str(val).strip().title()

    @staticmethod
    def description(val) -> DataFields.PENDING_ITEM_DESC_TYPE:
        n = "Description"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.PENDING_ITEM_DESC_TYPE)
        Validators.validateLength(
            val,
            n,
            DataFields.PENDING_ITEM_DESC_MIN_LENGTH,
            DataFields.PENDING_ITEM_DESC_MAX_LENGTH,
        )

        return str(val).strip().capitalize()

    @staticmethod
    def controlOwner(val) -> DataFields.FULL_NAME_TYPE:
        n = "Control Owner"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.FULL_NAME_TYPE)
        Validators.validateLength(
            val, n, DataFields.FULL_NAME_MIN_LENGTH, DataFields.FULL_NAME_MAX_LENGTH
        )
        Validators.validateFullName(val, n)

        return str(val).strip().title()

    @staticmethod
    def lastContactDate(val) -> DataFields.CONTACT_DATE_TYPE:
        n = "Last Contact Date"
        # Tests
        # Is initially set to None
        if val:
            Validators.validateType(val, n, DataFields.CONTACT_DATE_TYPE)

        return val

    @staticmethod
    def lineItemID(val) -> int:
        n = "Line Item Foreign Key"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, int)

        return int(val)
