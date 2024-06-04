const { forbiddenEndpoints } = require("../services");
const { forbiddenObjToArray } = require("../utils/forbiddenObjToArray");
const { sendJsonResponse } = require("../utils/sendJsonResponse");

//Middleware to forbid direct access to certain microservice endpoints outside the gateway
function blockDirectAccess(req, res, next) {
  //Convert the forbidden endpoints object into just an array of the endpoint literals
  const paths = forbiddenObjToArray(forbiddenEndpoints);

  //Send forbidden response if path is matched
  if (paths.includes(req.path)) {
    return sendJsonResponse(res, 403, "Forbidden");
  }
  next();
}

module.exports = { blockDirectAccess };
