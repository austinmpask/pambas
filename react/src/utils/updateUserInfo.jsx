import axios from "axios";

//Utils
import validateSettingsNameFields from "src/utils/validators/validateSettingsNameFields";

//Update first/last name from the settings page
export default async function updateUserInfo(formData, prettyNames) {
  //Ensure data is valid
  let errors = validateSettingsNameFields(formData, prettyNames);

  //Abort if there was a validation error
  if (errors) {
    return { ok: false, errors };
  }

  //Data is valid, make request to update the data
  try {
    const apiResponse = await axios.put("/api/userdata", {
      first_name: formData.firstName,
      last_name: formData.lastName,
    });

    //Successful update
    if (apiResponse && apiResponse.status === 200) {
      const message = JSON.parse(apiResponse.data.message);

      //Pass back the updated user info inorder to update context
      return {
        ok: true,
        firstName: message.first_name,
        lastName: message.last_name,
      };
    }
  } catch (error) {
    //Handle any errors from api
    errors = [`Internal error while updating user info: ${error}`];
  }

  //Bad api response, bubble up errors for presentation
  return {
    ok: false,
    errors,
  };
}
