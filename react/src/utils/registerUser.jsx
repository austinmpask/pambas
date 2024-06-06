import axios from "axios";
import missingRequiredFields from "src/utils/validators/missingRequiredFields";
import validateUserFields from "src/utils/validators/validateUserFields";

export default async function registerUser(formData, prettyNames) {
  //Validate that all fields have data
  let errors = missingRequiredFields(formData, prettyNames);
  if (errors) {
    return {
      ok: false,
      errors,
    };
  }

  //Validate/sanitize username, email, first/last, password
  errors = validateUserFields(formData, prettyNames);
  if (errors) {
    return {
      ok: false,
      errors,
    };
  }

  //Make request to api

  try {
    const apiResponse = await axios.post("/register", {
      username: formData.username,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      password: formData.password,
    });

    //Successful registration
    if (apiResponse && apiResponse.status === 201) {
      return {
        ok: true,
      };
    }
  } catch (error) {
    //Error while making request, determine if its from duplicate entry
    error.response.data.message &&
    error.response.data.message.includes("Bad response from")
      ? (errors = ["Username or email already registered!"])
      : (errors = ["Internal registration error, try again later"]);
  }

  //Bad api response
  return {
    ok: false,
    errors,
  };
}
