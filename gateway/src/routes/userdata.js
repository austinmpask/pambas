const express = require("express");
const { sendJsonResponse, apiEnd, apiFetch } = require("../utils/");
const { verifyJWT, simpleRequest } = require("../middlewares/");

const userDataRouter = express.Router();

//Get user data by UUID from user service and auth service
userDataRouter.get("/userdata", verifyJWT, async (req, res) => {
  //Make req. to user service
  const userApiEnd = apiEnd("/users", "/userdata");
  const userResp = await apiFetch("GET", userApiEnd, req.sessionUUID);

  //Abort and forward error if occurred
  if (userResp.status !== 200) {
    return sendJsonResponse(res, userResp.status, userResp.message);
  }

  //Make req. to auth service
  const authApiEnd = apiEnd("/auth", "/login");
  const authResp = await apiFetch("GET", authApiEnd, req.sessionUUID);

  //Abort and forward error if occurred
  if (authResp.status !== 200) {
    return sendJsonResponse(res, authResp.status, authResp.message);
  }
  //Successful api responses, send gateway response
  //Response includes first/last name, email, username
  return sendJsonResponse(res, 200, {
    firstName: userResp.message.first_name,
    lastName: userResp.message.last_name,
    ...authResp.message,
  });
});

//Update first or last name in user service
userDataRouter.put("/userdata", verifyJWT, simpleRequest("PUT", "/users"));

module.exports = userDataRouter;
