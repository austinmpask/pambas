const validator = require("email-validator");
//Validate integrity of user registration data before mutating any db
function validateRegData({ username, email, first_name, last_name, password }) {
  //Check each input against requirements
  if (username && email && first_name && last_name && password) {
    const validations = [
      validateUsername(username),
      validateEmail(email),
      validateName(first_name),
      validateName(last_name),
      validatePassword(password),
    ];

    //Return the first error encountered
    for (let validation of validations) {
      if (!validation.ok) {
        return validation;
      }
    }
  } else {
    //Incase of missing registration data
    return { ok: false, message: "Missing registration data" };
  }
  //No errors while validating
  return { ok: true, message: "Valid" };
}

//Individual validators

function validateUsername(username) {
  //Auth service expects:
  //String
  //Max length 20
  //No special characters

  if (typeof username !== "string")
    return { ok: false, message: "Username must be text" };

  if (username.length > 20)
    return { ok: false, message: "Username must be less than 20 characters" };

  if (!/^[a-zA-Z0-9]+$/.test(username))
    return { ok: false, message: "Username must be alphanumeric" };

  return { ok: true, message: "" };
}

function validateEmail(email) {
  //Auth service expects:
  //String
  //Max length 100
  //Is a valid email

  if (typeof email !== "string")
    return { ok: false, message: "Email must be text" };

  if (email.length > 100)
    return { ok: false, message: "Email must be less than 100 characters" };

  return validator.validate(email)
    ? { ok: true, message: "" }
    : { ok: false, message: "Invalid email" };
}

function validateName(name) {
  //User service expects:
  //String
  //Max length 20
  //Alpha only

  if (typeof name !== "string")
    return { ok: false, message: "Name must be text" };

  if (name.length > 20)
    return { ok: false, message: "Name must be less than 20 characters" };

  return /^[a-zA-Z]+$/.test(name)
    ? { ok: true, message: "" }
    : { ok: false, message: "Name must be a-Z only" };
}

function validatePassword(password) {
  //Auth service expects:
  //String
  //Min length 8
  //Max length 30
  if (typeof password !== "string")
    return { ok: false, message: "Password must be text" };

  return password.length < 8 || password.length > 30
    ? { ok: false, message: "Password must be atleast 8 characters" }
    : { ok: true, message: "" };
}

module.exports = { validateRegData };
