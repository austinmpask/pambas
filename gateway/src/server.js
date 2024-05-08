const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const fetch = require("node-fetch");

const services = require("./services");

const app = express();

const PORT = process.env.PORT || 3000;

//Security middleware
app.use(cors());
app.use(helmet());

//Logging middleware
app.use(morgan("tiny"));

//Forward requests to services
services.forEach(({ route, target }) => {
  app.use(
    route,
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      //Optional trailing "/" for endpoints
      pathRewrite: (path) => {
        const len = path.length;
        if (len > 1 && path[len - 1] === "/") {
          path = path.slice(0, -1);
        }
        return path;
      },
    })
  );
});

//Parse request body
app.use(express.json());

//Handle user registration, creates user in auth and user services
app.post("/register", async (req, res) => {
  //Extract needed components from req body
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  //Ensure not undefined or empty
  if (username && email && password) {
    //Get hosts for microservices
    const authHost = services.find((item) => item.route === "/auth").target;
    const userHost = services.find((item) => item.route === "/users").target;

    const endpoint = "/register";

    //Construct the microservice endpoints
    const authRegUrl = authHost + endpoint;
    const userRegUrl = userHost + endpoint;

    //Tell auth service to handle registration
    try {
      const authResponse = await fetch(authRegUrl, {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: { "Content-Type": "application/json" },
      });
      res.status(201).end("success");
    } catch (e) {
      res.status(500).json({
        code: 500,
        status: "Error",
        message: "Internal server error",
      });
    }

    //Tell user service to handle registration
  } else {
    res.status(400).json({
      code: 400,
      status: "Error",
      message: "Missing registration arguments",
    });
  }
});

//404 not found error
app.use((_req, res) => {
  res.status(404).json({
    code: 404,
    status: "Error",
    message: "Invalid request.",
  });
});

app.listen(PORT, () => {
  console.log(`Gateway is listening on port ${PORT}`);
});

module.exports = app;
