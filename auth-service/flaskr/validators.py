from flaskr.config import DataFields
import uuid
import validators


# ----- Generic error message builders ----- #


def lengthError(name, minL, maxL):
    return f"{name} length must be between {minL} and {maxL} characters"


def noneError(name):
    return f"{name} must not be empty"


def typeError(name, expected):
    return f"{name} must be {expected.__name__} type"


def userNameError(name):
    return f"{name} can only contain letters, numbers, '.' and '_'"


def emailError(name):
    return f"Invalid {name}"


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
    def validateUUID(val):
        try:
            val = uuid.UUID(val)
        except (ValueError, TypeError):
            raise ValueError("Invalid UUID")
        return val

    @staticmethod
    def validateUserNameChars(val, prettyName):
        # Allowed are a-Z 0-9 . _

        # Remove the 2 characters that are allowed if present
        alphNumStr = val.replace(".", "").replace("_", "")

        # Make sure the rest of the characters are just alphanumeric
        if not alphNumStr.isalnum():
            raise ValueError(userNameError(prettyName))

        return val

    @staticmethod
    def validateEmail(val, prettyName):
        if not validators.email(val):
            raise ValueError(emailError(prettyName))

        return val

    @staticmethod
    def validatePlainPassword(val):
        # Must have:
        # Uppercase, Lowercase
        # Number
        # One of: !@#$%^&*()_+-=[]{}<>?,.~|

        allowedSpecials = "!@#$%^&*()_+-=[]{}<>?,.~|"

        # Remove allowed special characters
        for char in allowedSpecials:
            val = val.replace(char, "")

        # Make sure the rest of the password is alphanumeric only
        if not val.isalnum():
            raise ValueError("Password contains prohibited character")

        # Make sure atleast one lowercase, one uppercase
        if val.isupper() or val.islower() or val.isnumeric():
            raise ValueError(
                "Password must contain both uppercase and lowercase letters"
            )

        # Make sure there is a number
        if val.isalpha():
            raise ValueError("Password must contain atleast one number")

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
    def userName(val) -> DataFields.USER_NAME_TYPE:
        n = "Username"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.USER_NAME_TYPE)
        Validators.validateLength(
            val, n, DataFields.USER_NAME_MIN_LEN, DataFields.USER_NAME_MAX_LEN
        )
        Validators.validateUserNameChars(val, n)
        return val.strip()

    @staticmethod
    def email(val) -> DataFields.EMAIL_TYPE:
        n = "E-Mail"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.EMAIL_TYPE)
        Validators.validateLength(
            val, n, DataFields.EMAIL_MIN_LEN, DataFields.EMAIL_MAX_LEN
        )
        Validators.validateEmail(val, n)
        return val.strip()

    @staticmethod
    def plainPassword(val) -> DataFields.PW_PLAIN_TYPE:
        n = "Password"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, DataFields.PW_PLAIN_TYPE)
        Validators.validateLength(
            val, n, DataFields.PW_PLAIN_MIN_LEN, DataFields.PW_PLAIN_MAX_LEN
        )
        Validators.validatePlainPassword(val)
        return val.strip()

    @staticmethod
    def credential(val) -> str:
        n = "Credential"
        # Tests
        Validators.validateExists(val, n)
        Validators.validateType(val, n, str)

        # Determine if it is email or username, email is treated as default
        if validators.email(val):
            return (True, Validators.email(val))
        # Username
        else:
            return (False, Validators.userName(val))
