const express = require("express");
const { sendJsonResponse } = require("../utils/sendJsonResponse");
const { getApiEndpoint } = require("../utils/getApiEndpoint");
const { apiFetch } = require("../utils/apiFetch");
const { verifyJWT } = require("../middlewares/verifyJWT");

const userDataRouter = express.Router();

//Get user data, requires JWT
userDataRouter.get("/userdata", verifyJWT, async (req, res) => {
  //Get full API endpoints which will be used later
  const userApiEndpoint = getApiEndpoint("/users", "/userdata");
  const authApiEndpoint = getApiEndpoint("/auth", "/getlogin");

  //Make request to microservices, errors handled by helper

  //User service request
  const userRes = await apiFetch(res, "GET", userApiEndpoint, req.sessionUUID);
  if (!userRes) return;

  //Auth service request
  const authRes = await apiFetch(res, "GET", authApiEndpoint, req.sessionUUID);
  if (!authRes) return;

  //Successful api responses, send gateway response
  return sendJsonResponse(
    res,
    200,
    JSON.stringify({
      ...userRes.message,
      ...authRes.message,
    })
  );
});

//Update first or last name
userDataRouter.put("/userdata", verifyJWT, async (req, res) => {
  //Get endpoint, send api req.
  const apiEndpoint = getApiEndpoint("/users", "/userdata");

  const apiRes = await apiFetch(
    res,
    "PUT",
    apiEndpoint,
    req.sessionUUID,
    req.body
  );
  if (!apiRes) return;

  //Successful api response, send gateway response
  return sendJsonResponse(res, 200, JSON.stringify(apiRes.message));
});

module.exports = { userDataRouter };
