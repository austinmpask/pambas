import validator from "validator";

export default function validLoginCredential(credential) {
  const payload = {};
  //Determine if credential is email or username
  if (validator.isEmail(credential)) {
    //Valid email credential, add to payload
    payload.email = credential;
  } else if (validator.isAlphanumeric(credential)) {
    //Credential is valid alpha numeric only
    payload.username = credential;
  }

  //Abort if credential was invalid for both email and username
  return !payload.email && !payload.username ? false : payload;
}
