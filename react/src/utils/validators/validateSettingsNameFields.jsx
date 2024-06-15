import validator from "validator";

//Ensure that first name and last name meet requirements of db. Fields are optional
export default function validateSettingsNameFields(formData, prettyNames) {
  const errors = [];

  //Make sure first, last are alphanumeric
  for (let item in formData) {
    //Fields are optional
    if (formData[item] && !validator.isAlpha(formData[item])) {
      errors.push(`${prettyNames[item]} must be a-Z only!`);
    }
  }

  //Define min and max length of strings
  const lengths = {
    firstName: [1, 20],
    lastName: [1, 20],
  };

  //Make sure all fields meet length requirements
  for (let item in formData) {
    //Fields are optional
    if (formData[item]) {
      const len = formData[item].length;
      const min = lengths[item][0];
      const max = lengths[item][1];

      if (len < min) {
        errors.push(`${prettyNames[item]} must be atleast ${min} characters!`);
      } else if (len > max) {
        errors.push(`${prettyNames[item]} must less than ${max} characters!`);
      }
    }
  }

  //Return all the errors if present, if not, return false
  return errors.length === 0 ? false : errors;
}
