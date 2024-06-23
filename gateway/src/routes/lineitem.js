const express = require("express");
const { verifyJWT } = require("../middlewares/verifyJWT");
const { sendJsonResponse } = require("../utils/sendJsonResponse");
const { apiFetch } = require("../utils/apiFetch");
const { getApiEndpoint } = require("../utils/getApiEndpoint");

const lineItemRouter = express.Router();

lineItemRouter.put("/lineitem/:id", verifyJWT, async (req, res) => {
  const apiEndpoint = getApiEndpoint("/notes", `/lineitem/${req.params.id}`);

  const response = await apiFetch(
    "PUT",
    apiEndpoint,
    req.sessionUUID,
    req.body
  );

  let status = 200;

  if (!response.ok) {
    status = 500;
  }
  console.log(response);
  return sendJsonResponse(res, status, JSON.stringify(response.message || ""));
});

module.exports = { lineItemRouter };
