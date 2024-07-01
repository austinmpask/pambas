const { default: axios } = require("axios");
const express = require("express");
const { sendJsonResponse, apiEnd } = require("../utils");

const loginRouter = express.Router();

//Forward login req. to auth service, no JWT middleware needed
loginRouter.post("/login", async (req, res) => {
  //Construct the microservice endpoint
  const apiEndpoint = apiEnd("/auth", "/login");

  try {
    //Use axios instead for easier forwarding
    const response = await axios.post(apiEndpoint, req.body, {
      withCredentials: true,
    });

    // Forward JWT to the frontend
    const cookies = response.headers["set-cookie"];
    if (cookies) {
      res.setHeader("Set-Cookie", cookies);
    }

    //Send the response on success
    return sendJsonResponse(res, response.status, response.data.message);
  } catch (e) {
    //Forward error if occurs
    const status = e.response ? e.response.status : 500;

    return sendJsonResponse(res, status, e.message);
  }
});

module.exports = loginRouter;
