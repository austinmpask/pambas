const fetch = require("node-fetch");
const { sendJsonResponse } = require("./sendJsonResponse");

async function apiFetch(res, method, endpoint, uuid, body = undefined) {
  //Determine appropriate options for fetch & UUID placement
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
  }

  //Attempt to send response to endpoint, if successful, return response body
  let response;
  let responseBody;
  try {
    response = await fetch(endpoint, options);
    responseBody = await response.json();
  } catch (e) {
    //Error while making request, exit
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
    //Bad server response
    sendJsonResponse(res, 500, `Bad response from ${endpoint}`);
  }
}

module.exports = { apiFetch };
