//Standardized response formatting
function sendJsonResponse(res, code, message) {
  res.status(code).json({
    code,
    message: message,
  });
}

module.exports = sendJsonResponse;
