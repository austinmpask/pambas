const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { sendJsonResponse } = require("./utils/");

//Constants

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://frontend:3000/";
const app = express();

//Routers
const {
  healthRouter,
  userDataRouter,
  registerRouter,
  projectRouter,
  lineItemRouter,
  openItemRouter,
  loginRouter,
} = require("./routes");

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

//Parse request bodies
app.use(express.json());

//Add routers for gateway endpoints
app.use(healthRouter);
app.use(userDataRouter);
app.use(registerRouter);
app.use(projectRouter);
app.use(lineItemRouter);
app.use(openItemRouter);
app.use(loginRouter);

//404 not found error
app.use((_req, res) => {
  return sendJsonResponse(res, 404, "Bad request");
});

//Start app
app.listen(PORT, () => {
  console.log(`Gateway is listening on port ${PORT}`);
});

module.exports = app;
