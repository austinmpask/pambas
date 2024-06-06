import missingRequiredFields from "src/utils/validators/missingRequiredFields";
import validLoginCredential from "src/utils/validators/validLoginCredential";
import axios from "axios";

//Attempt to login the user upon form submission
export default async function loginUser(formData) {
  //Validate that all fields have data
  const errors = missingRequiredFields(formData);
  if (errors) {
    return {
      ok: false,
      errors,
    };
  }

  //Make sure that login credential is valid email or username
  const credValid = validLoginCredential(formData.credential);

  if (!credValid) {
    return {
      ok: false,
      errors: ["Invalid username/email"],
    };
  }

  //Prepare payload for API req.
  const payload = {
    password: formData.password,
    ...credValid,
  };

  //Make request to api
  try {
    const apiResponse = await axios.post("/auth/login", payload);
    //Success
    if (apiResponse && apiResponse.status === 200) {
      return {
        ok: true,
      };
    }
  } catch {
    //Error while making request
    return {
      ok: false,
      errors: ["Invalid login"],
    };
  }

  //Fallback for bad api response
  return {
    ok: false,
    errors: ["No response/invalid response from auth server"],
  };
}
