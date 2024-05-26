const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.SECRET_KEY || "secret";

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

//Middleware for protected routes requiring user auth
function verifyJWT(req, res, next) {
  //Take token from parsed cookies
  const token = req.cookies.token || undefined;

  if (!token) {
    return sendJsonResponse(res, 405, "Forbidden, token missing");
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    //No errors = valid token, pass UUID from payload to req for subsequent use
    req.sessionUUID = decoded.uuid;
    next();
  } catch (e) {
    return sendJsonResponse(res, 405, "Forbidden, invalid token");
  }
}

module.exports = { sendJsonResponse, forbiddenObjToArray, verifyJWT };
