import validator from "validator";

//Ensure that first name, last name, username, email, password meet requirements of db
export default function validateUserFields(formData, prettyNames) {
  const errors = [];

  //Email validate
  if (!validator.isEmail(formData.email)) {
    errors.push("Email is invalid!");
  }

  //Separate out the fields that must be alphanumeric only
  const alphanumerics = { ...formData };
  delete alphanumerics.email;
  delete alphanumerics.password;

  //Make sure first, last, username are alphanumeric
  for (let item in alphanumerics) {
    if (!validator.isAlphanumeric(alphanumerics[item])) {
      errors.push(`${prettyNames[item]} must not contain special characters!`);
    }
  }

  //Define min and max length of strings
  const lengths = {
    firstName: [1, 20],
    lastName: [1, 20],
    email: [5, 100],
    username: [3, 20],
    password: [8, 50],
  };

  //Make sure all fields meet length requirements
  for (let item in formData) {
    const len = formData[item].length;
    const min = lengths[item][0];
    const max = lengths[item][1];

    if (len < min) {
      errors.push(`${prettyNames[item]} must be atleast ${min} characters!`);
    } else if (len > max) {
      errors.push(`${prettyNames[item]} must less than ${max} characters!`);
    }
  }

  //Return all the errors if present, if not, return false
  return errors.length === 0 ? false : errors;
}
