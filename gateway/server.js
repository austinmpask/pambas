const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("./services");

const app = express();

const PORT = process.env.PORT || 3000;

//Security middleware
app.use(cors());
app.use(helmet());

//Logging middleware
app.use(morgan("tiny"));

//Forward requests
services.forEach(({ route, target }) => {
  app.use(
    route,
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
    })
  );
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
