const fetch = require("node-fetch");

//This module is largely to reduce boilerplate, and is tailored specifically for the specific requirements of existing gateway endpoints
async function apiFetch(method, endpoint, uuid = undefined, body = undefined) {
  //Determine appropriate fetch options for fetch & UUID placement
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
      break;

    case "DELETE":
      options = {
        method: "DELETE",
        body: JSON.stringify({ uuid: String(uuid) }),
        headers: { "Content-Type": "application/json" },
      };
      break;
  }

  //Attempt to fetch from endpoint, if successful, return response body
  let response;
  let responseBody;
  try {
    response = await fetch(endpoint, options);
    responseBody = await response.json();
  } catch (e) {
    //Return error info if request failed
    return {
      ok: false,
      message: `Internal server error at ${endpoint}: ${String(e)}`,
    };
  }

  if (response && responseBody && response.ok) {
    //Successful request and response, return response body
    return {
      ok: true,
      message: responseBody.message,
    };
  } else {
    //Return error response if failed
    return {
      ok: false,
      message: `Bad response from ${endpoint}: ${responseBody.message}`,
    };
  }
}

module.exports = { apiFetch };
