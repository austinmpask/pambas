import axios from "axios";

//Utils
import addProjectMissingFields from "src/utils/validators/projectForm/addProjectMissingFields";
import repeatedSections from "src/utils/validators/projectForm/repeatedSections";
import leftHandValidate from "src/utils/validators/projectForm/leftHandValidate";
import sectionNumberNumeric from "src/utils/validators/projectForm/sectionNumberNumeric";

//Helper to add a new project after the new project form is completed. Errors separated to not overwhelm end user
export default async function addProject(formData, prettyNames, childrenState) {
  //Check for any missing fields for both parts of form (general info/left hand and dynamic info/right hand)
  let errors = addProjectMissingFields(formData, prettyNames, childrenState);

  //Abort if there were missing fields
  if (errors) {
    return { ok: false, errors };
  }

  //Validate left hand fields
  errors = leftHandValidate(formData, prettyNames);
  //Abort if there were validation errors
  if (errors) {
    return { ok: false, errors };
  }

  //Validate right hand fields
  // if (sectionNumberNumeric(childrenState)) {
  //   return {
  //     ok: false,
  //     errors: ["Section/Control must be numeric!"],
  //   };
  // }

  //Check that section # wasnt repeated
  errors = repeatedSections(childrenState);

  //Abort if there were repeated sections
  if (errors) {
    return { ok: false, errors };
  }

  //Make request to api
  try {
    const apiResponse = await axios.post("/api/project", {
      name: formData.name,
      type: formData.type,
      budget: formData.budget,
      manager: formData.manager,
      sections: childrenState,
    });

    //Successfully added project
    if (apiResponse && apiResponse.status === 201) {
      return {
        ok: true,
      };
    }
  } catch (error) {
    //Forward any error
    errors = [`Internal error while adding project: ${error}`];
  }

  //Catch all incase something else does not work
  return {
    ok: false,
    errors: ["Bad API reponse while adding project, try again later"],
  };
}
