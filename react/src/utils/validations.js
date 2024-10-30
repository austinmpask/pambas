//Generic error builders for validation violations
function requiredMsg(field) {
  return `${field} is required`;
}

function rangeError(field, minL, maxL) {
  return `${field} must be between ${String(minL)} and ${String(
    maxL
  )} characters`;
}

function alphaNumericError(field, type) {
  //Type = validation pattern (alphanumeric etc.)
  return `${field} must be ${type}`;
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

  static CONTROL_OWNER_NAME_LABEL = "Control Owner";

  static PROJECT_TYPE_LABEL = "Project Type";
  static PROJECT_TYPE_MIN_LENGTH = 2;
  static PROJECT_TYPE_MAX_LENGTH = 15;

  //Options for react-select
  static S1T1_NAME = "SOC 1 Type 1";
  static S1T1_SELECT = { value: 0, label: this.S1T1_NAME };

  static S1T2_NAME = "SOC 1 Type 2";
  static S1T2_SELECT = { value: 1, label: this.S1T2_NAME };

  static S2T1_NAME = "SOC 2 Type 1";
  static S2T1_SELECT = { value: 2, label: this.S2T1_NAME };

  static S2T2_NAME = "SOC 2 Type 2";
  static S2T2_SELECT = { value: 3, label: this.S2T2_NAME };

  static OTHER_NAME = "Other";
  static OTHER_SELECT = { value: 4, label: this.OTHER_NAME };

  static PROJECT_TYPES = [
    this.S1T1_SELECT,
    this.S1T2_SELECT,
    this.S2T1_SELECT,
    this.S2T2_SELECT,
    this.OTHER_SELECT,
  ];

  static DEFAULT_PROJ_TYPE = this.S2T2_SELECT;

  static PROJECT_THEME_LABEL = "Color Theme";

  static THEME_RED_SELECT = {
    value: 0,
    label: "Red",
    thumb: "text-danger",
  };

  static THEME_GREEN_SELECT = {
    value: 1,
    label: "Green",
    thumb: "text-success",
  };

  static THEME_BLUE_SELECT = {
    value: 2,
    label: "Blue",
    thumb: "text-primary",
  };

  static PROJECT_THEME_TYPES = [
    this.THEME_RED_SELECT,
    this.THEME_GREEN_SELECT,
    this.THEME_BLUE_SELECT,
  ];

  static DEFAULT_PROJECT_THEME = this.THEME_RED_SELECT;

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

  static PENDING_ITEM_NAME_LABEL = "Item Name";
  static PENDING_ITEM_NAME_MIN_LENGTH = 2;
  static PENDING_ITEM_NAME_MAX_LENGTH = 40;

  static PENDING_ITEM_DESC_LABEL = "Pending Item Description";
  static PENDING_ITEM_DESC_MIN_LENGTH = 0;
  static PENDING_ITEM_DESC_MAX_LENGTH = 200;

  static QUERY_KEYWORDS = [
    "query",
    "queries",
    "pulled",
    "filter",
    "filtered",
    "sql",
    "generated",
    "generate",
  ];
  static POPULATION_KEYWORDS = ["pop", "population", "populations", "all"];
  static SAMPLE_KEYWORDS = [
    "sample",
    "sampled",
    "selected",
    "selection",
    "each",
    "every",
    "randomly",
    "random",
    "person",
    "chosen",
  ];
  static LOG_KEYWORDS = ["log", "list", "export", "listing", "csv"];
  static IMAGE_KEYWORDS = [
    "image",
    "images",
    "screenshot",
    "screenshots",
    "showing",
    "shows",
    "picture",
    "pictures",
    "screen",
    "shot",
    "capture",
  ];
  static POLICY_KEYWORDS = [
    "policy",
    "policies",
    "plan",
    "procedure",
    "procedures",
    "test",
    "drp",
    "isp",
    "handbook",
    "copy",
  ];
}

export class UIVars {
  static LINE_ANIM_WAIT_MS = 260;
  static LINE_HOVER_DELAY_MS = 50;
  static HANGING_FLAG_ANIM_MS = 330;
  static PENDING_MENU_OPEN_ANIM_MS = 65;
  static PENDING_ITEM_IN_ANIM_MS = 300;

  static HEADER_MENU_IN_ANIM_MS = 360;
  static PROJ_GRID_IN_ANIM_MS = 460;

  static BUTTON_RAISE_ANIM_MS = 150;
  static BUTTON_RAISE_HEIGHT_PX = 5;
  static BUTTON_RAISE_RADIUS_TOP_PX = 6;
  static BUTTON_RAISE_RADIUS_BOTTOM_PX = 8;
  static BUTTON_BORDER_TRANSITION_MS = 150;

  static BUTTON_ACTIVE_ZINDEX = 0;
  static BUTTON_INACTIVE_ZINDEX = 0;

  // static NOTE_EXPANDED_HEIGHT_PX = 100;
  // static NOTE_COLLAPSED_HEIGHT_PX = 56;

  static NOTE_HELPER_DELAY_IN_MS = 200;
  static NOTE_HELPER_DELAY_OUT_MS = 50;

  static TOOLTIP_DELAY_MS = 500;

  //UI User settings

  //Line Activation Delay
  static XSLOW = "None";
  static XSLOW_SELECT = { value: 0, label: this.XSLOW };

  static SLOW = "Low";
  static SLOW_SELECT = { value: 20, label: this.SLOW };

  static NORMAL = "Default";
  static NORMAL_SELECT = { value: 100, label: this.NORMAL };

  static HIGH = "High";
  static HIGH_SELECT = { value: 200, label: this.HIGH };

  static LINE_ACTIVATION_DELAY_OPTIONS = [
    this.XSLOW_SELECT,
    this.SLOW_SELECT,
    this.NORMAL_SELECT,
    this.HIGH_SELECT,
  ];

  static ROW_HEIGHT_PX_OPTIONS = [45, 60, 75];
  static ROW_EXPANDED_PX_OPTIONS = [90, 120, 170];

  static INPUT_SIZE_PRESET_PX = {
    xs: "sm:w-[150px]",
    s: "sm:w-[200px]",
    m: "sm:w-[250px]",
    l: "sm:w-[300px]",
  };

  static DEFAULT_LINE_DELAY = this.NORMAL_SELECT;

  static REDIRECT_DELAY_MS = 2000;
}

export const Colors = {
  success: "#00FF9B",
  successShadow: "#0a8f5a",

  danger: "#FF3A85",
  dangerShadow: "#a12554",

  primary: "#11E6FF",
  primaryShadow: "#128694",

  warn: "#FFFF5C",
  warnShadow: "#a6a630",

  lightBg: "#FFFFFF",
  lightShadow: "#CED6D6",

  turquoise: "#00D1B2",
};

//Template for user settings key/value
export const UserSettings = {
  darkMode: false,
  tooltips: true,
  fancyVisuals: true,
  confirmDelOpenItem: true,
  completeProgress: false,
  autoFillManager: false,
  highContrast: false,
  rowHoverDelayPreset: 1,
  tooltipHoverDelayPreset: 2,
  rowHeightPreset: 1,
  rowExpandedPreset: 1,
  defaultProjectType: 3,
  defaultColorTheme: 0,
  defaultManager: "",
};

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
    pattern: {
      value: /[0-9]/,
      message: alphaNumericError(DataFields.BUDGET_LABEL, "numeric"),
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

  static PendingItemName = {
    required: requiredMsg(DataFields.PENDING_ITEM_NAME_LABEL),
    minLength: {
      value: DataFields.PENDING_ITEM_NAME_MIN_LENGTH,
      message: rangeError(
        DataFields.PENDING_ITEM_NAME_LABEL,
        DataFields.PENDING_ITEM_NAME_MIN_LENGTH,
        DataFields.PENDING_ITEM_NAME_MAX_LENGTH
      ),
    },
    maxLength: {
      value: DataFields.PENDING_ITEM_NAME_LABEL,
      message: rangeError(
        DataFields.PENDING_ITEM_NAME_LABEL,
        DataFields.PENDING_ITEM_NAME_MIN_LENGTH,
        DataFields.PENDING_ITEM_NAME_MAX_LENGTH
      ),
    },
  };

  static ControlOwnerName = {
    minLength: {
      value: DataFields.FULL_NAME_MIN_LENGTH,
      message: rangeError(
        DataFields.CONTROL_OWNER_NAME_LABEL,
        DataFields.FULL_NAME_MIN_LENGTH,
        DataFields.FULL_NAME_MAX_LENGTH
      ),
    },
    maxLength: {
      value: DataFields.FULL_NAME_MAX_LENGTH,
      message: rangeError(
        DataFields.CONTROL_OWNER_NAME_LABEL,
        DataFields.FULL_NAME_MIN_LENGTH,
        DataFields.FULL_NAME_MAX_LENGTH
      ),
    },
  };

  static PendingItemDesc = {
    minLength: {
      value: DataFields.PENDING_ITEM_DESC_MIN_LENGTH,
      message: rangeError(
        DataFields.PENDING_ITEM_DESC_LABEL,
        DataFields.PENDING_ITEM_DESC_MIN_LENGTH,
        DataFields.PENDING_ITEM_DESC_MAX_LENGTH
      ),
    },
    maxLength: {
      value: DataFields.PENDING_ITEM_DESC_MAX_LENGTH,
      message: rangeError(
        DataFields.PENDING_ITEM_DESC_LABEL,
        DataFields.PENDING_ITEM_DESC_MIN_LENGTH,
        DataFields.PENDING_ITEM_DESC_MAX_LENGTH
      ),
    },
  };
}
