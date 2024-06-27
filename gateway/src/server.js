const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const helmet = require("helmet");
const { createProxyMiddleware } = require("http-proxy-middleware");
const morgan = require("morgan");

//Custom middlewares
const { blockDirectAccess } = require("./middlewares/blockDirectAccess");

//Helpers & constants
const { sendJsonResponse } = require("./utils/sendJsonResponse");
const { services } = require("./services");
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://frontend:3000/";
const app = express();

//Routers
const { healthRouter } = require("./routes/health");
const { userDataRouter } = require("./routes/userdata");
const { registerRouter } = require("./routes/register");
const { projectRouter } = require("./routes/project");
const { allProjectsRouter } = require("./routes/allProjects");
const { lineItemRouter } = require("./routes/lineitem");
const { openItemRouter } = require("./routes/openitem");

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

//Forward requests to services for unblocked endpoints
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

//Add routers for gateway endpoints
app.use(healthRouter);
app.use(userDataRouter);
app.use(registerRouter);
app.use(projectRouter);
app.use(allProjectsRouter);
app.use(lineItemRouter);
app.use(openItemRouter);

//404 not found error
app.use((_req, res) => {
  return sendJsonResponse(res, 404, "Bad request");
});

//Start app
app.listen(PORT, () => {
  console.log(`Gateway is listening on port ${PORT}`);
});

module.exports = app;
