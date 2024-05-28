const cors = require("cors");
const express = require("express");
const fetch = require("node-fetch");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");

//Custom middlewares
const { verifyJWT } = require("./middlewares/verifyJWT");
const { blockDirectAccess } = require("./middlewares/blockDirectAccess");

//Helpers & constants
const { sendJsonResponse } = require("./utils/sendJsonResponse");
const { services } = require("./services");

//Routers
const { healthRouter } = require("./routes/health");
const { userDataRouter } = require("./routes/userdata");
const { registerRouter } = require("./routes/register");

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://frontend:3000/";

const app = express();

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
app.use(morgan("tiny"));

//Parse cookies
app.use(cookieParser());

//Custom middleware to prevent direct access to certain microservice endpoints outside of the gateway
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

//Parse request bodies
app.use(express.json());

//Routers
app.use(healthRouter);
app.use(userDataRouter);
app.use(registerRouter);

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

//404 not found error
app.use((_req, res) => {
  return sendJsonResponse(res, 404, "Bad request");
});

app.listen(PORT, () => {
  console.log(`Gateway is listening on port ${PORT}`);
});

module.exports = app;
