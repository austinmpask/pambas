import validator from "validator";

export default function leftHandValidate(formData, prettyNames) {
  const errors = [];

  //Check if project name is 20 char or less
  if (formData.name.length > 20) {
    errors.push(`${prettyNames.name} must be 20 characters or less!`);
  }

  //Check if project name is alphanumeric
  if (!validator.isAlphanumeric(formData.name, undefined, { ignore: " " })) {
    errors.push(`${prettyNames.name} must not contain special characters!`);
  }

  //Check if budget hours is numeric
  if (!validator.isNumeric(formData.budget)) {
    errors.push(`${prettyNames.budget} must be a number!`);
  }

  //Check if manager name is 25 char or less
  if (formData.manager.length > 25) {
    errors.push(`${prettyNames.manager} must be 25 characters or less!`);
  }
  //Check if manager name is alpha
  if (!validator.isAlpha(formData.manager, undefined, { ignore: " " })) {
    errors.push(`${prettyNames.manager} must be a-Z!`);
  }

  return errors.length ? errors : false;
}
