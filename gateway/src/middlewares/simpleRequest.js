const { apiEnd, apiFetch, sendJsonResponse } = require("../utils/");

//Middleware for making requests when there is no additional logic needed
function simpleRequest(method, service, body) {
  return async (req, res) => {
    //Get the path to forward to service
    const path = req.originalUrl;
    //Construct the microservice endpoint
    const apiEndpoint = apiEnd(service, path);

    //Make request to api
    const { status, message } = await apiFetch(
      method,
      apiEndpoint,
      req.sessionUUID,
      body || req.body
    );

    //Forward to frontend
    return sendJsonResponse(res, status, message);
  };
}

module.exports = simpleRequest;
