const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const fetch = require("node-fetch");

const services = require("./services");
const { sendJsonResponse } = require("./util");

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
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const password = req.body.password;

  //Ensure not undefined or empty
  if (username && email && password && firstName && lastName) {
    //Get hosts for microservices
    const authHost = services.find((item) => item.route === "/auth").target;
    const userHost = services.find((item) => item.route === "/users").target;

    const endpoint = "/register";
    const removeEndpoint = "/shallowdelete";

    //Construct the microservice endpoints
    const authRegUrl = authHost + endpoint;
    const authRemUrl = authHost + removeEndpoint;
    const userRegUrl = userHost + endpoint;

    //Tell auth service to handle registration
    let authResponse;
    try {
      authResponse = await fetch(authRegUrl, {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      sendJsonResponse(res, 500, "Internal auth server error: ", String(e));
    }

    //If successful, tell user service to handle registration
    if (authResponse && authResponse.status === 201) {
      const responseBody = await authResponse.json();
      const user_uuid = responseBody.uuid;

      let userResponse;
      try {
        userResponse = await fetch(userRegUrl, {
          method: "POST",
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            uuid: user_uuid,
          }),
          headers: { "Content-Type": "application/json" },
        });
      } catch (e) {
        //Remove user from auth DB since user was not added to the user DB
        await fetch(authRemUrl, {
          method: "DELETE",
          body: JSON.stringify({
            uuid: user_uuid,
          }),
          headers: { "Content-Type": "application/json" },
        });

        //Send error response
        sendJsonResponse(res, 500, "Internal user server error", String(e));
      }

      //Successful registration
      if (userResponse && userResponse.status === 201) {
        sendJsonResponse(res, 201, "Successful registration");
      } else {
        //If no user response or non OK status

        //Remove user from auth DB since user was not added to the user DB
        await fetch(authRemUrl, {
          method: "DELETE",
          body: JSON.stringify({
            uuid: user_uuid,
          }),
          headers: { "Content-Type": "application/json" },
        });

        //Forward the error stack
        let userResponseBody;
        if (userResponse) {
          userResponseBody = await userResponse.json();
        }

        sendJsonResponse(
          res,
          500,
          "No response/invalid response from user server",
          JSON.stringify(userResponseBody)
        );
      }
    } else {
      //If no auth response or non OK status

      //Forward the error stack
      let authResponseBody;
      if (authResponse) {
        authResponseBody = await authResponse.json();
      }
      sendJsonResponse(
        res,
        500,
        "No response/invalid response from auth server:",
        JSON.stringify(authResponseBody)
      );
    }
  } else {
    sendJsonResponse(res, 400, "Missing registration arguments");
  }
});

//404 not found error
app.use((_req, res) => {
  sendJsonResponse(res, 404, "Bad request");
});

app.listen(PORT, () => {
  console.log(`Gateway is listening on port ${PORT}`);
});

module.exports = app;
