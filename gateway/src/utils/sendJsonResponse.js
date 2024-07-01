//Standardized response formatting
function sendJsonResponse(res, code, message) {
  res.status(code).json({
    code,
    message: JSON.stringify(message),
  });
}

module.exports = sendJsonResponse;
