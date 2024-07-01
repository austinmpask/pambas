const express = require("express");
const { verifyJWT, simpleRequest } = require("../middlewares/");

const openItemRouter = express.Router();

//Update the last contacted date on an open item
openItemRouter.put(
  "/openitem/:id/followup",
  verifyJWT,
  simpleRequest("PUT", "/notes", {})
);

//Update open item details (name, owner, description)
openItemRouter.put("/openitem/:id", verifyJWT, simpleRequest("PUT", "/notes"));

//Delete an open item by id
openItemRouter.delete(
  "/openitem/:id",
  verifyJWT,
  simpleRequest("DELETE", "/notes")
);

//Create a new openitem
openItemRouter.post("/openitem", verifyJWT, simpleRequest("POST", "/notes"));

module.exports = openItemRouter;
