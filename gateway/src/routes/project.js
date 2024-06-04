const express = require("express");
const { verifyJWT } = require("../middlewares/verifyJWT");
const { sendJsonResponse } = require("../utils/sendJsonResponse");
const { apiFetch } = require("../utils/apiFetch");
const { getApiEndpoint } = require("../utils/getApiEndpoint");

const projectRouter = express.Router();

//Create new project for a user
projectRouter.post("/project", verifyJWT, async (req, res) => {
  //Assign microservice endpoint for use
  const apiEndpoint = getApiEndpoint("/notes", "/project");

  //Add UUID to body for service request
  const body = { ...req.body, uuid: String(req.sessionUUID) };

  //Make request to note service
  const response = await apiFetch("POST", apiEndpoint, undefined, body);

  //Respond accordingly based on note service response
  const status = response.ok ? 201 : 500;
  return sendJsonResponse(res, status, response.message);
});

module.exports = { projectRouter };
