const fetch = require("node-fetch");

//Reduce fetch boilerplate when making service requests
async function apiFetch(
  method,
  endpoint,
  userUUID = undefined,
  body = undefined
) {
  //Determine appropriate fetch options, i.e. if body is required
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(userUUID && { userUUID }),
    },
  };

  // Add JSON body for put/post. PATCH not used
  if ((method === "PUT" || method === "POST") && body) {
    options.body = JSON.stringify(body);
  }

  //Attempt to fetch from endpoint, if successful, return response body message from service
  try {
    const response = await fetch(endpoint, options);
    const { status, message } = await response.json();

    return { status, message };
  } catch (e) {
    //Return error info if there was an error with request
    return {
      status: 500,
      message: `Internal server error at ${endpoint}: ${String(e)}`,
    };
  }
}

module.exports = apiFetch;
