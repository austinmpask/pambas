const express = require("express");
const { verifyJWT } = require("../middlewares/verifyJWT");
const { sendJsonResponse } = require("../utils/sendJsonResponse");
const { apiFetch } = require("../utils/apiFetch");
const { getApiEndpoint } = require("../utils/getApiEndpoint");

const openItemRouter = express.Router();

openItemRouter.put("/openitem/:id/followup", verifyJWT, async (req, res) => {
  const apiEndpoint = getApiEndpoint(
    "/notes",
    `/openitem/${req.params.id}/followup`
  );

  const response = await apiFetch("PUT", apiEndpoint, req.sessionUUID, {});

  const status = response.ok ? 200 : 500;

  return sendJsonResponse(res, status, response.message);
});

openItemRouter.put("/openitem/:id", verifyJWT, async (req, res) => {
  const apiEndpoint = getApiEndpoint("/notes", `/openitem/${req.params.id}`);

  const response = await apiFetch(
    "PUT",
    apiEndpoint,
    req.sessionUUID,
    req.body
  );

  const status = response.ok ? 200 : 500;

  return sendJsonResponse(res, status, response.message);
});

openItemRouter.delete("/openitem/:id", verifyJWT, async (req, res) => {
  const apiEndpoint = getApiEndpoint("/notes", `/openitem/${req.params.id}`);

  const response = await apiFetch("DELETE", apiEndpoint, req.sessionUUID);

  const status = response.ok ? 200 : 500;

  return sendJsonResponse(res, status, response.message);
});

openItemRouter.post("/openitem", verifyJWT, async (req, res) => {
  const apiEndpoint = getApiEndpoint("/notes", "/openitem");

  const body = { ...req.body, uuid: String(req.sessionUUID) };

  const response = await apiFetch("POST", apiEndpoint, undefined, body);

  const status = response.ok ? 201 : 500;

  return sendJsonResponse(res, status, response.message);
});

module.exports = { openItemRouter };
