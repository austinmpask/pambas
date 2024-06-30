from flaskr.config import DataFields
import uuid


# ----- Generic error message builders ----- #


def lengthError(name, minL, maxL):
    return f"{name} length must be between {minL} and {maxL} characters"


def noneError(name):
    return f"{name} must not be empty"


def alphaError(name):
    return f"{name} must only contain letters"


def typeError(name, expected):
    return f"{name} must be {expected.__name__} type"


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
    def validateAlpha(val, prettyName):
        if not val.isalpha():
            raise ValueError(alphaError(prettyName))
        return val

    @staticmethod
    def validateFullName(val, n):
        splitStr = val.split(" ")
        for word in splitStr:
            Validators.validateAlpha(word, n)
        return val

    @staticmethod
    def validateUUID(val):
        try:
            val = uuid.UUID(val)
        except (ValueError, TypeError):
            raise ValueError("Invalid UUID")
        return val

    @staticmethod
    def validateNumeric(val, prettyName):
        if not val.isnumeric():
            raise ValueError(f"{prettyName} must be numeric")
        return val

    # ----- USER MODEL ----- #

    @staticmethod
    def userUUID(val) -> uuid.UUID:
        n = "UUID"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.UUID_TYPE)
        return val

    @staticmethod
    def stringUUID(val) -> uuid.UUID:
        n = "UUID as String"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, str)
        # Convert to uuid obj
        return Validators.validateUUID(val)

    @staticmethod
    def firstName(val) -> DataFields.NAME_TYPE:
        n = "First Name"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.NAME_TYPE)
        # Alpha only, but spaces allowed
        Validators.validateFullName(val, n)
        Validators.validateLength(
            val, n, DataFields.FIRST_NAME_MIN_LENGTH, DataFields.FIRST_NAME_MAX_LENGTH
        )

        return val.strip().title()

    @staticmethod
    def lastName(val) -> DataFields.NAME_TYPE:
        n = "Last Name"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.NAME_TYPE)
        # Alpha only, but spaces allowed
        Validators.validateFullName(val, n)
        Validators.validateLength(
            val, n, DataFields.LAST_NAME_MIN_LENGTH, DataFields.LAST_NAME_MAX_LENGTH
        )

        return val.strip().title()
