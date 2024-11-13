const express = require("express");
const { verifyJWT, simpleRequest } = require("../middlewares/");

const projectRouter = express.Router();

//Get a specific project's details which is owned by a user
projectRouter.get("/project/:id", verifyJWT, simpleRequest("GET", "/notes"));

//Edit project summary data by ID
projectRouter.put("/project/:id", verifyJWT, simpleRequest("PUT", "/notes"));

//Create new project for a user
projectRouter.post("/project", verifyJWT, simpleRequest("POST", "/notes"));

//Get all projects by UUID
projectRouter.get("/project", verifyJWT, simpleRequest("GET", "/notes"));

//Delete a project and all children
projectRouter.delete(
  "/project/:id",
  verifyJWT,
  simpleRequest("DELETE", "/notes")
);

module.exports = projectRouter;
