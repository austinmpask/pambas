//Generic error builders for validation violations
function requiredMsg(field) {
  return `${field} is required`;
}

function rangeError(field, minL, maxL) {
  return `${field} must be between ${String(minL)} and ${String(
    maxL
  )} characters`;
}

//Data requirements which line up with backend for use in form validation
export class DataFields {
  static CRED_LABEL = "Username/Email";
  static CRED_MIN = 3;
  static CRED_MAX = 64;

  static EMAIL_LABEL = "Email";
  static EMAIL_MIN = 5;
  static EMAIL_MAX = 64;

  static USER_LABEL = "Username";
  static USER_MIN = 3;
  static USER_MAX = 20;

  static FIRST_NAME_LABEL = "First Name";
  static LAST_NAME_LABEL = "Last Name";

  static NAME_SINGLE_MIN = 2;
  static NAME_SINGLE_MAX = 25;

  static PASS_LABEL = "Password";
  static PASS_MIN = 8;
  static PASS_MAX = 64;

  static PROJECT_TITLE_LABEL = "Project Title";
  static PROJECT_TITLE_MIN_LENGTH = 2;
  static PROJECT_TITLE_MAX_LENGTH = 30;

  static BUDGET_LABEL = "Budget";
  static BUDGET_MIN = 0;
  static BUDGET_MAX = 200;
  static BUDGET_INCREMENTAL = 0.25;

  static BILLED_LABEL = "Billed";
  static BILLED_MIN = 0;
  static BILLED_MAX = 200;
  static BILLED_INCREMENTAL = 0.25;

  static FULL_NAME_LABEL = "Name";
  static FULL_NAME_MIN_LENGTH = 2;
  static FULL_NAME_MAX_LENGTH = 50;

  static PROJECT_TYPE_LABEL = "Project Type";
  static PROJECT_TYPE_MIN_LENGTH = 2;
  static PROJECT_TYPE_MAX_LENGTH = 15;

  static PROJECT_TYPES = [
    "SOC 1 Type 1",
    "SOC 1 Type 2",
    "SOC 2 Type 1",
    "SOC 2 Type 2",
    "Other",
  ];

  static HEADER_LABEL = "Column Header";
  static HEADER_MIN_LENGTH = 0;
  static HEADER_MAX_LENGTH = 15;

  static SECTIONS_LABEL = "Sections";
  static SECTIONS_LIST_MIN = 1;
  static SECTIONS_LIST_MAX = 20;

  static SECTION_CONTROLS_LABEL = "Controls Per Section";
  static SECTION_CONTROLS_MIN = 1;
  static SECTION_CONTROLS_MAX = 25;

  static SECTION_NUM_LABEL = "Section Number";
  static SECTION_NUM_MIN = 1;
  static SECTION_NUM_MAX = 99;

  static CONTROL_NUM_MIN_LENGTH = 4;
  static CONTROL_NUM_MAX_LENGTH = 5;

  static CHECKBOX_VAL_MIN = 0;
  static CHECKBOX_VAL_MAX = 2;

  static NOTES_LABEL = "Notes";
  static NOTES_MIN_LENGTH = 0;
  static NOTES_MAX_LENGTH = 2000;

  static NUM_CHECKBOX = 3;

  static PENDING_ITEM_NAME_LABEL = "Pending Item Name";
  static PENDING_ITEM_NAME_MIN_LENGTH = 2;
  static PENDING_ITEM_NAME_MAX_LENGTH = 40;

  static PENDING_ITEM_DESC_LABEL = "Pending Item Description";
  static PENDING_ITEM_DESC_MIN_LENGTH = 0;
  static PENDING_ITEM_DESC_MAX_LENGTH = 200;
}

//React hook form validators for use in forms
export class Validators {
  static LoginCredential = {
    required: requiredMsg(DataFields.CRED_LABEL),
    minLength: {
      value: DataFields.CRED_MIN,
      message: rangeError(
        DataFields.CRED_LABEL,
        DataFields.CRED_MIN,
        DataFields.CRED_MAX
      ),
    },
    maxLength: {
      value: DataFields.CRED_MAX,
      message: rangeError(
        DataFields.CRED_LABEL,
        DataFields.CRED_MIN,
        DataFields.CRED_MAX
      ),
    },
  };

  static Password = {
    required: requiredMsg(DataFields.PASS_LABEL),
    minLength: {
      value: DataFields.PASS_MIN,
      message: rangeError(
        DataFields.PASS_LABEL,
        DataFields.PASS_MIN,
        DataFields.PASS_MAX
      ),
    },
    maxLength: {
      value: DataFields.PASS_MAX,
      message: rangeError(
        DataFields.PASS_LABEL,
        DataFields.PASS_MIN,
        DataFields.PASS_MAX
      ),
    },
  };

  static FirstName = {
    required: requiredMsg(DataFields.FIRST_NAME_LABEL),
    minLength: {
      value: DataFields.NAME_SINGLE_MIN,
      message: rangeError(
        DataFields.FIRST_NAME_LABEL,
        DataFields.NAME_SINGLE_MIN,
        DataFields.NAME_SINGLE_MAX
      ),
    },
    maxLength: {
      value: DataFields.NAME_SINGLE_MAX,
      message: rangeError(
        DataFields.FIRST_NAME_LABEL,
        DataFields.NAME_SINGLE_MIN,
        DataFields.NAME_SINGLE_MAX
      ),
    },
  };

  static LastName = {
    required: requiredMsg(DataFields.LAST_NAME_LABEL),
    minLength: {
      value: DataFields.NAME_SINGLE_MIN,
      message: rangeError(
        DataFields.LAST_NAME_LABEL,
        DataFields.NAME_SINGLE_MIN,
        DataFields.NAME_SINGLE_MAX
      ),
    },
    maxLength: {
      value: DataFields.NAME_SINGLE_MAX,
      message: rangeError(
        DataFields.LAST_NAME_LABEL,
        DataFields.NAME_SINGLE_MIN,
        DataFields.NAME_SINGLE_MAX
      ),
    },
  };

  static Email = {
    required: requiredMsg(DataFields.EMAIL_LABEL),
    minLength: {
      value: DataFields.EMAIL_MIN,
      message: rangeError(
        DataFields.EMAIL_LABEL,
        DataFields.EMAIL_MIN,
        DataFields.EMAIL_MAX
      ),
    },
    maxLength: {
      value: DataFields.EMAIL_MAX,
      message: rangeError(
        DataFields.EMAIL_LABEL,
        DataFields.EMAIL_MIN,
        DataFields.EMAIL_MAX
      ),
    },
  };

  static Username = {
    required: requiredMsg(DataFields.USER_LABEL),
    minLength: {
      value: DataFields.USER_MIN,
      message: rangeError(
        DataFields.USER_LABEL,
        DataFields.USER_MIN,
        DataFields.USER_MAX
      ),
    },
    maxLength: {
      value: DataFields.USER_MAX,
      message: rangeError(
        DataFields.USER_LABEL,
        DataFields.USER_MIN,
        DataFields.USER_MAX
      ),
    },
  };

  static ProjectName = {
    required: requiredMsg(DataFields.PROJECT_TITLE_LABEL),
    minLength: {
      value: DataFields.PROJECT_TITLE_MIN_LENGTH,
      message: rangeError(
        DataFields.PROJECT_TITLE_LABEL,
        DataFields.PROJECT_TITLE_MIN_LENGTH,
        DataFields.PROJECT_TITLE_MAX_LENGTH
      ),
    },
    maxLength: {
      value: DataFields.PROJECT_TITLE_MAX_LENGTH,
      message: rangeError(
        DataFields.PROJECT_TITLE_LABEL,
        DataFields.PROJECT_TITLE_MIN_LENGTH,
        DataFields.PROJECT_TITLE_MAX_LENGTH
      ),
    },
  };

  static ProjectType = {
    required: requiredMsg(DataFields.PROJECT_TYPE_LABEL),
    minLength: {
      value: DataFields.PROJECT_TYPE_MIN_LENGTH,
      message: rangeError(
        DataFields.PROJECT_TYPE_LABEL,
        DataFields.PROJECT_TYPE_MIN_LENGTH,
        DataFields.PROJECT_TYPE_MAX_LENGTH
      ),
    },
    maxLength: {
      value: DataFields.PROJECT_TYPE_MAX_LENGTH,
      message: rangeError(
        DataFields.PROJECT_TYPE_LABEL,
        DataFields.PROJECT_TYPE_MIN_LENGTH,
        DataFields.PROJECT_TYPE_MAX_LENGTH
      ),
    },
  };

  static Budget = {
    required: requiredMsg(DataFields.BUDGET_LABEL),
    minLength: {
      value: DataFields.BUDGET_MIN,
      message: rangeError(
        DataFields.BUDGET_LABEL,
        DataFields.BUDGET_MIN,
        DataFields.BUDGET_MAX
      ),
    },
    maxLength: {
      value: DataFields.BUDGET_MAX,
      message: rangeError(
        DataFields.BUDGET_LABEL,
        DataFields.BUDGET_MIN,
        DataFields.BUDGET_MAX
      ),
    },
  };

  static Manager = {
    required: requiredMsg(DataFields.FULL_NAME_LABEL),
    minLength: {
      value: DataFields.FULL_NAME_MIN_LENGTH,
      message: rangeError(
        DataFields.FULL_NAME_LABEL,
        DataFields.FULL_NAME_MIN_LENGTH,
        DataFields.FULL_NAME_MAX_LENGTH
      ),
    },
    maxLength: {
      value: DataFields.FULL_NAME_MAX_LENGTH,
      message: rangeError(
        DataFields.FULL_NAME_LABEL,
        DataFields.FULL_NAME_MIN_LENGTH,
        DataFields.FULL_NAME_MAX_LENGTH
      ),
    },
  };
}