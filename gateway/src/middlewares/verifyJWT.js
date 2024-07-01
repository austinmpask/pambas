const jwt = require("jsonwebtoken");
const { sendJsonResponse } = require("../utils/");

const JWT_SECRET_KEY = process.env.SECRET_KEY || "secret";

//Middleware to verify JWT for protected routes
function verifyJWT(req, res, next) {
  //Take token from parsed cookies
  const token = req.cookies.token || undefined;

  if (!token) {
    return sendJsonResponse(res, 403, "Forbidden: Missing JWT");
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    //No errors = valid token, pass UUID from payload to req for subsequent use
    req.sessionUUID = decoded.uuid;
    next();
  } catch (e) {
    return sendJsonResponse(res, 403, "Forbidden: Invalid JWT");
  }
}

module.exports = verifyJWT;
