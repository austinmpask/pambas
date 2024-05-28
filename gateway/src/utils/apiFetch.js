const fetch = require("node-fetch");
const { sendJsonResponse } = require("./sendJsonResponse");

async function apiFetch(
  res,
  method,
  endpoint,
  uuid = undefined,
  body = undefined
) {
  //Determine appropriate options for fetch & UUID placement
  //UUID will go in header for GET, and in body for otherwise
  let options;
  switch (method) {
    case "GET":
      options = {
        method: "GET",
        headers: { "Content-Type": "application/json", uuid },
      };
      break;

    case "PUT":
      options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, uuid: String(uuid) }),
      };
      break;

    case "POST":
      options = {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      };
  }

  //Attempt to fetch from endpoint, if successful, return response body
  let response;
  let responseBody;
  try {
    response = await fetch(endpoint, options);
    responseBody = await response.json();
  } catch (e) {
    //Send error response directly if failed
    sendJsonResponse(
      res,
      500,
      `Internal server error at ${endpoint}`,
      String(e)
    );
  }

  if (response && responseBody && response.ok) {
    //Successful request and response, return response body
    return responseBody;
  } else {
    //Send error response directly if failed
    sendJsonResponse(res, 500, `Bad response from ${endpoint}`);
  }

  //If nothing returned, api request failed, and an error response has been sent
}

module.exports = { apiFetch };
