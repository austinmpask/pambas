const express = require("express");
const { sendJsonResponse } = require("../utils/sendJsonResponse");

const healthRouter = express.Router();

//Health check for compose
healthRouter.get("/health", (_req, res) => {
  return sendJsonResponse(res, 200, "ok");
});

module.exports = { healthRouter };
