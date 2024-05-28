const cors = require("cors");
const express = require("express");
const fetch = require("node-fetch");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { services, forbiddenEndpoints } = require("./services");
const { sendJsonResponse, forbiddenObjToArray, verifyJWT } = require("./utils");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://frontend:3000/";

//Security middleware, allow frontend
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(helmet());

//Logging middleware
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

//Parse cookies
app.use(cookieParser());

//Forbid direct access to certain microservice endpoints
const blockDirectAccess = (req, res, next) => {
  //Convert the forbidden endpoints object into just an array of the endpoint literals
  const paths = forbiddenObjToArray(forbiddenEndpoints);

  //Send forbidden response if path is matched
  if (paths.includes(req.path)) {
    return sendJsonResponse(res, 403, "Forbidden");
  }
  next();
};

app.use(blockDirectAccess);

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

//Health check for compose
app.get("/health", (_req, res) => {
  return sendJsonResponse(res, 200, "ok");
});

//Create new project for a user
app.post("/project", verifyJWT, async (req, res) => {
  const notesHost = services.find((item) => item.route === "/notes").target;
  const endpoint = "/project";
  const apiEndpoint = notesHost + endpoint;

  let apiResponse;
  let responseBody;

  try {
    apiResponse = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...req.body, uuid: String(req.sessionUUID) }),
    });
    responseBody = await apiResponse.json();
  } catch (e) {
    return sendJsonResponse(500, "Internal note server error", String(e));
  }

  if (apiResponse && apiResponse.status === 201) {
    sendJsonResponse(res, 201, JSON.stringify(responseBody));
  }
});

//Update first or last name
app.put("/userdata", verifyJWT, async (req, res) => {
  const userHost = services.find((item) => item.route === "/users").target;
  const endpoint = "/userdata";
  const apiEndpoint = userHost + endpoint;

  let apiResponse;
  let responseBody;

  try {
    apiResponse = await fetch(apiEndpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...req.body, uuid: String(req.sessionUUID) }),
    });

    responseBody = await apiResponse.json();
  } catch (e) {
    return sendJsonResponse(res, 500, "Internal user server error", String(e));
  }

  if (apiResponse && apiResponse.status === 200) {
    //Success
    sendJsonResponse(res, 200, JSON.stringify(responseBody.message));
  }
});

//Get user data, requires JWT
app.get("/userdata", verifyJWT, async (req, res) => {
  //Construct the endpoint for user service
  const userHost = services.find((item) => item.route === "/users").target;
  const endpoint = "/userdata";

  const authHost = services.find((item) => item.route === "/auth").target;
  const authEndpoint = "/getlogin";

  const apiEndpoint = userHost + endpoint;
  const authApiEndpoint = authHost + authEndpoint;

  //Make request to the user service
  let userServiceResponse;
  let responseBody;
  try {
    userServiceResponse = await fetch(apiEndpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json", UUID: req.sessionUUID },
    });
    responseBody = await userServiceResponse.json();
  } catch (e) {
    return sendJsonResponse(res, 500, "Internal user server error", String(e));
  }

  if (userServiceResponse && userServiceResponse.status === 200) {
    //Success, make request to auth service for username and email
    let authServiceResponse;
    let authResponseBody;
    try {
      authServiceResponse = await fetch(authApiEndpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json", UUID: req.sessionUUID },
      });
      authResponseBody = await authServiceResponse.json();
    } catch (e) {
      return sendJsonResponse(
        res,
        500,
        "Internal auth server error",
        String(e)
      );
    }

    if (authServiceResponse && authServiceResponse.status === 200) {
      return sendJsonResponse(
        res,
        200,
        JSON.stringify({ ...responseBody.message, ...authResponseBody.message })
      );
    } else {
      //Bad response/no response from the auth service
      return sendJsonResponse(
        res,
        500,
        "No response/invalid response from auth server",
        JSON.stringify(responseBody)
      );
    }
  } else {
    //Bad response/no response from the user service
    return sendJsonResponse(
      res,
      500,
      "No response/invalid response from user server",
      JSON.stringify(responseBody)
    );
  }
});

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
      return sendJsonResponse(
        res,
        500,
        "Internal auth server error",
        String(e)
      );
    }

    //If successful, tell user service to handle registration
    if (authResponse && authResponse.status === 201) {
      const responseBody = await authResponse.json();
      const user_uuid = responseBody.message;

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
        return sendJsonResponse(
          res,
          500,
          "Internal user server error",
          String(e)
        );
      }

      //Successful registration
      if (userResponse && userResponse.status === 201) {
        return sendJsonResponse(res, 201, "Successful registration");
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

        return sendJsonResponse(
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
      return sendJsonResponse(
        res,
        500,
        "No response/invalid response from auth server:",
        JSON.stringify(authResponseBody)
      );
    }
  } else {
    return sendJsonResponse(res, 400, "Missing registration arguments");
  }
});

//404 not found error
app.use((_req, res) => {
  return sendJsonResponse(res, 404, "Bad request");
});

app.listen(PORT, () => {
  console.log(`Gateway is listening on port ${PORT}`);
});

module.exports = app;
