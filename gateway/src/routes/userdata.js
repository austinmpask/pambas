const express = require("express");
const { sendJsonResponse } = require("../utils/sendJsonResponse");
const { getApiEndpoint } = require("../utils/getApiEndpoint");
const { apiFetch } = require("../utils/apiFetch");
const { verifyJWT } = require("../middlewares/verifyJWT");

const userDataRouter = express.Router();

//Get user data by UUID from user service and auth service
//Services expect UUID in request header
userDataRouter.get("/userdata", verifyJWT, async (req, res) => {
  //Get full API endpoints which will be used later
  const userApiEndpoint = getApiEndpoint("/users", "/userdata");
  const authApiEndpoint = getApiEndpoint("/auth", "/getlogin");

  //Make request to microservices, errors handled by helper

  //Make req. to user service
  const userRes = await apiFetch("GET", userApiEndpoint, req.sessionUUID);
  //If no respnse from helper, request failed and appropriate response has been sent
  if (!userRes.ok) return sendJsonResponse(res, 500, userRes.message);

  //Make req. to auth service
  const authRes = await apiFetch("GET", authApiEndpoint, req.sessionUUID);
  if (!authRes.ok) return sendJsonResponse(res, 500, authRes.message);

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

//Update first or last name in user service
//Gateway expected request body: first_name, last_name
//User service expected request body: first_name, last_name, uuid*
userDataRouter.put("/userdata", verifyJWT, async (req, res) => {
  //Get endpoint, send api req.
  const apiEndpoint = getApiEndpoint("/users", "/userdata");

  const apiRes = await apiFetch("PUT", apiEndpoint, req.sessionUUID, req.body);
  if (!apiRes.ok) return sendJsonResponse(res, 500, apiRes.message);

  //Successful api response, send gateway response
  return sendJsonResponse(res, 200, JSON.stringify(apiRes.message));
});

module.exports = { userDataRouter };
