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

module.exports = { sendJsonResponse };
