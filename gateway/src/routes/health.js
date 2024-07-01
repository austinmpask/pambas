const express = require("express");
const { sendJsonResponse } = require("../utils");

const healthRouter = express.Router();

//Health check for docker compose
healthRouter.get("/health", (_req, res) => {
  return sendJsonResponse(res, 200, "OK from gateway");
});

module.exports = healthRouter;
