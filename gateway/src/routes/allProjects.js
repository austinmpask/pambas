const express = require("express");
const { sendJsonResponse } = require("../utils/sendJsonResponse");
const { getApiEndpoint } = require("../utils/getApiEndpoint");
const { apiFetch } = require("../utils/apiFetch");
const { verifyJWT } = require("../middlewares/verifyJWT");

const allProjectsRouter = express.Router();

//Get all projects by UUID from note service
//Services expect UUID in request header
allProjectsRouter.get("/allprojects", verifyJWT, async (req, res) => {
  //Get full API endpoint for request to note service
  const apiEndpoint = getApiEndpoint("/notes", "/allprojects");

  //Make request to note service, inject UUID in request header
  const response = await apiFetch("GET", apiEndpoint, req.sessionUUID);

  let status = 200;
  if (!response.ok) {
    status = 500;
  }

  //Forward the response to gateway
  return sendJsonResponse(res, status, JSON.stringify(response.message));
});

module.exports = { allProjectsRouter };
