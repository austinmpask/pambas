//Utils
import toTitle from "src/utils/toTitle";
import { DataFields } from "src/utils/validations";

//Convert form data for new project into expected format for note service. Validation handled by form inputs
export default function formatNewProject(formData, sectionsData) {
  //Get the type and theme out of the select component set
  const type = DataFields.PROJECT_TYPES.find(
    (type) => type.value === Number(formData.type.values().next().value)
  ).label;
  const theme = formData.theme.values().next().value;

  //Convert sections from form into expected format
  const sections = sectionsData.map((entry) => ({
    section: entry[0],
    controls: entry[1],
  }));

  //Combine data for request
  const payload = {
    name: toTitle(formData.name),
    manager: toTitle(formData.manager),
    budget: formData.budget,
    type,
    theme,
    sections,
  };

  return payload;
}
