const express = require("express");
const { sendJsonResponse } = require("../utils/sendJsonResponse");
const { validateRegData } = require("../utils/validateRegData");
const { getApiEndpoint } = require("../utils/getApiEndpoint");
const { apiFetch } = require("../utils/apiFetch");

const registerRouter = express.Router();

//Handle user registration, creates user in auth and user services
//Auth service expected request body: username, email, password
//User service expected request body: uuid, first_name, last_name
registerRouter.post("/register", async (req, res) => {
  //Ensure the request body is complete and clean
  const { ok, message } = validateRegData(req.body);

  //If invalid, respond with the error
  if (!ok) return sendJsonResponse(res, 400, message);

  //Assign microservice endpoints for use
  const authApiEndpoint = getApiEndpoint("/auth", "/register");
  const userApiEndpoint = getApiEndpoint("/users", "/register");

  //Make registration request to auth service
  const authRes = await apiFetch("POST", authApiEndpoint, undefined, req.body);

  //Send error response if bad api response
  if (!authRes.ok) return sendJsonResponse(res, 500, authRes.message);

  //With successful resposne, api will pass the UUID in the response body. Extract
  const userUUID = authRes.message;

  //Register the user in the user db with the same UUID returned by auth db
  const userRes = await apiFetch("POST", userApiEndpoint, undefined, {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    uuid: userUUID,
  });

  if (!userRes.ok) {
    //If there was an error with the user registration, roll back the auth registration
    const authRemEndpoint = getApiEndpoint("/auth", "/shallowdelete");
    const delRes = await apiFetch("DELETE", authRemEndpoint, userUUID);

    if (delRes.ok) {
      //If the rollback was successful, respond with the error from the user service only
      return sendJsonResponse(res, 500, userRes.message);
    } else {
      //If the rollback was unsuccessful, respond with errors from user service & deletion attempt
      return sendJsonResponse(res, 500, {
        userError: userRes.message,
        authError: delRes.message,
      });
    }
  }

  //Success if the user response is ok
  return sendJsonResponse(res, 201, "Successful registration");
});

module.exports = { registerRouter };
