const express = require("express");
const { verifyJWT, simpleRequest } = require("../middlewares/");

const lineItemRouter = express.Router();

// Retrieve a list of open items associated with a line item
lineItemRouter.get(
  "/lineitem/:id/openitems",
  verifyJWT,
  simpleRequest("GET", "/notes")
);
//Edit a line item by id
lineItemRouter.put("/lineitem/:id", verifyJWT, simpleRequest("PUT", "/notes"));

module.exports = lineItemRouter;
