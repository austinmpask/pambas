//Utils
import missingRequiredFields from "src/utils/validators/missingRequiredFields";

//Missing field validation for both components of the new project form
export default function addProjectMissingFields(
  formData,
  prettyNames,
  childrenState
) {
  const errors = [];

  //Check if any fields are empty for left hand of form
  const leftErrors = missingRequiredFields(formData, prettyNames);

  //Add any errors to the list
  if (leftErrors) {
    errors.push(...leftErrors);
  }

  //Add an error if a section number or # of controls is missing from the dynamic section
  if (
    childrenState.some((item) => {
      return !item.section || !item.controls;
    })
  ) {
    errors.push("Missing section/control number!");
  }

  //Return the error list if it isnt empty
  return errors.length !== 0 ? errors : false;
}
