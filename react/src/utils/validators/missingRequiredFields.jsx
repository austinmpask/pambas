//Ensure all fields are present with data

export default function missingRequiredFields(formData) {
  const errors = [];
  for (let field in formData) {
    if (!formData[field]) {
      errors.push(field[0].toUpperCase() + field.slice(1) + " is required!");
    }
  }
  return errors.length === 0 ? false : errors;
}
