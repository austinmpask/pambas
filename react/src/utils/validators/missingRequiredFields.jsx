//Ensure all fields are present with data

export default function missingRequiredFields(formData, prettyNames) {
  const errors = [];
  for (let field in formData) {
    if (!formData[field]) {
      //Use formatted field name for error message, or just capitalize it otherwise
      const fieldName = prettyNames
        ? prettyNames[field]
        : field[0].toUpperCase() + field.slice(1);

      //Add missing field to errors
      errors.push(`${fieldName} is required!`);
    }
  }

  //Return list of errors to present, or false if there is nothing missing
  return errors.length === 0 ? false : errors;
}
