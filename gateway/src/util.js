//Easier sending success/error messages from gateway
function sendJsonResponse(res, code, message, trace = "None available") {
  const okCodes = [200, 201];
  res.status(code).json({
    code: code,
    status: okCodes.includes(code) ? "Success" : "Error",
    message: message,
    trace: trace,
  });
}

//Convert the human readable forbidden endpoints object to an array of endpoint literals
function forbiddenObjToArray(obj) {
  const paths = [];

  for (let [service, endpoints] of Object.entries(obj)) {
    endpoints.forEach((endpoint) => {
      const route = "/" + service + endpoint;
      paths.push(route);
      paths.push(route + "/");
    });
  }
  return paths;
}

module.exports = { sendJsonResponse, forbiddenObjToArray };
