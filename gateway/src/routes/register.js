const express = require("express");
const { sendJsonResponse, apiEnd, apiFetch } = require("../utils/");

const registerRouter = express.Router();

//Handle user registration, creates user in auth and user services
registerRouter.post("/register", async (req, res) => {
  //Assign microservice endpoints for use
  const authEnd = apiEnd("/auth", "/register");
  const userEnd = apiEnd("/users", "/register");

  //Make registration request to auth service. Should respond with UUID
  const authResp = await apiFetch("POST", authEnd, undefined, req.body);

  //Abort if bad auth response
  if (authResp.status !== 201) {
    return sendJsonResponse(res, authResp.status, authResp.message);
  }

  //Register the user in the user db with the same UUID returned by auth db. User service will validate
  const body = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  //Make request
  const userResp = await apiFetch("POST", userEnd, authResp.message, body);

  //If there was an error with the user registration, roll back the auth registration
  if (userResp.status !== 201) {
    const authDelEnd = apiEnd("/auth", "/shallowdelete");
    const delResp = await apiFetch("DELETE", authDelEnd, authResp.message);

    //Forward the error that caused the rollback
    if (delResp.status === 200) {
      return sendJsonResponse(res, 500, userResp.message);
    }

    //If there was an issue deleting the user, forward that instead
    return sendJsonResponse(
      res,
      500,
      `Error while rolling back User addition to auth service: ${delResp.message}`
    );
  }

  //Successful registration
  return sendJsonResponse(res, 201, "Success");
});

module.exports = registerRouter;
