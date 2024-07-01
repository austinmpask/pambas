const express = require("express");
const { verifyJWT } = require("../middlewares/");
const { sendJsonResponse, apiFetch, apiEnd } = require("../utils/");

const projectRouter = express.Router();

//Get a specific project's details which is owned by a user
projectRouter.get("/project/:id", verifyJWT, async (req, res) => {
  //Construct api endpoint
  const apiEndpoint = apiEnd("/notes", `/project/${req.params.id}`);

  //Make api request
  const { status, response } = await apiFetch(
    "GET",
    apiEndpoint,
    req.sessionUUID
  );

  //Forward to frontend
  return sendJsonResponse(res, status, response);
});

projectRouter.put("/project/:id", verifyJWT, async (req, res) => {
  const apiEndpoint = apiEnd("/notes", `/project/${req.params.id}`);
  const response = await apiFetch(
    "PUT",
    apiEndpoint,
    req.sessionUUID,
    req.body
  );

  const status = response.ok ? 200 : 500;

  return sendJsonResponse(res, status, JSON.stringify(response.message || ""));
});

//Create new project for a user
projectRouter.post("/project", verifyJWT, async (req, res) => {
  //Assign microservice endpoint for use
  const apiEndpoint = apiEnd("/notes", "/project");

  //Add UUID to body for service request
  const body = { ...req.body, uuid: String(req.sessionUUID) };

  //Make request to note service
  const response = await apiFetch("POST", apiEndpoint, undefined, body);

  //Respond accordingly based on note service response
  const status = response.ok ? 201 : 500;
  return sendJsonResponse(res, status, response.message);
});

//Get all projects by UUID from note service
//Services expect UUID in request header
projectRouter.get("/project", verifyJWT, async (req, res) => {
  //Get full API endpoint for request to note service
  const apiEndpoint = apiEnd("/notes", "/project");

  //Make request to note service, inject UUID in request header
  const response = await apiFetch("GET", apiEndpoint, req.sessionUUID);

  //Forward the response to gateway
  return sendJsonResponse(
    res,
    response.status,
    JSON.stringify(response.message)
  );
});

module.exports = projectRouter;
