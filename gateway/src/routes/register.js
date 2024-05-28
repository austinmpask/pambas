const express = require("express");
const { sendJsonResponse } = require("../utils/sendJsonResponse");
const { validateRegData } = require("../utils/validateRegData");
const { getApiEndpoint } = require("../utils/getApiEndpoint");
const { apiFetch } = require("../utils/apiFetch");

const registerRouter = express.Router();

//Handle user registration, creates user in auth and user services
registerRouter.post("/register", async (req, res) => {
  //Ensure the request body is complete and clean
  const { ok, message } = validateRegData(req.body);

  //If invalid, respond with the error
  if (!ok) return sendJsonResponse(res, 400, message);

  const authApiEndpoint = getApiEndpoint("/auth", "/register");
  const userApiEndpoint = getApiEndpoint("/users", "/register");

  //Make registration request to auth service
  const authRes = await apiFetch("POST", authApiEndpoint, undefined, req.body);
  if (!authRes.ok) return sendJsonResponse(res, 500, authRes.message);

  const userUUID = authRes.message;

  const userRes = await apiFetch("POST", userApiEndpoint, undefined, {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    uuid: userUUID,
  });

  if (!userRes.ok) {
    //If there was an error with the user registration, roll back the auth registration
    const authRemEndpoint = getApiEndpoint("/auth", "/shallowdelete");
    const delRes = await apiFetch("DELETE", authRemEndpoint, userUUID);

    if (delRes.ok) {
      return sendJsonResponse(res, 500, userRes.message);
    } else {
      return sendJsonResponse(res, 500, {
        userError: userRes.message,
        authError: delRes.message,
      });
    }
  }

  return sendJsonResponse(res, 201, "Successful registration");

  //Ensure not undefined or empty
  // if (username && email && password && firstName && lastName) {
  //   //Get hosts for microservices
  //   // const authHost = services.find((item) => item.route === "/auth").target;
  //   // const userHost = services.find((item) => item.route === "/users").target;

  //   // const endpoint = "/register";
  //   // const removeEndpoint = "/shallowdelete";

  //   // //Construct the microservice endpoints
  //   // const authRegUrl = authHost + endpoint;
  //   // const authRemUrl = authHost + removeEndpoint;
  //   // const userRegUrl = userHost + endpoint;

  //   //Tell auth service to handle registration
  //   // let authResponse;
  //   // try {
  //   //   authResponse = await fetch(authRegUrl, {
  //   //     method: "POST",
  //   //     body: JSON.stringify(req.body),
  //   //     headers: { "Content-Type": "application/json" },
  //   //   });
  //   // } catch (e) {
  //   //   return sendJsonResponse(
  //   //     res,
  //   //     500,
  //   //     "Internal auth server error",
  //   //     String(e)
  //   //   );
  //   // }

  //   //If successful, tell user service to handle registration
  //   if (authResponse && authResponse.status === 201) {
  //     const responseBody = await authResponse.json();
  //     const user_uuid = responseBody.message;

  //     let userResponse;
  //     try {
  //       userResponse = await fetch(userRegUrl, {
  //         method: "POST",
  //         body: JSON.stringify({
  //           first_name: firstName,
  //           last_name: lastName,
  //           uuid: user_uuid,
  //         }),
  //         headers: { "Content-Type": "application/json" },
  //       });
  //     } catch (e) {
  //       //Remove user from auth DB since user was not added to the user DB
  //       await fetch(authRemUrl, {
  //         method: "DELETE",
  //         body: JSON.stringify({
  //           uuid: user_uuid,
  //         }),
  //         headers: { "Content-Type": "application/json" },
  //       });

  //       //Send error response
  //       return sendJsonResponse(
  //         res,
  //         500,
  //         "Internal user server error",
  //         String(e)
  //       );
  //     }

  //     //Successful registration
  //     if (userResponse && userResponse.status === 201) {
  //       return sendJsonResponse(res, 201, "Successful registration");
  //     } else {
  //       //If no user response or non OK status

  //       //Remove user from auth DB since user was not added to the user DB
  //       await fetch(authRemUrl, {
  //         method: "DELETE",
  //         body: JSON.stringify({
  //           uuid: user_uuid,
  //         }),
  //         headers: { "Content-Type": "application/json" },
  //       });

  //       //Forward the error stack
  //       let userResponseBody;
  //       if (userResponse) {
  //         userResponseBody = await userResponse.json();
  //       }

  //       return sendJsonResponse(
  //         res,
  //         500,
  //         "No response/invalid response from user server",
  //         JSON.stringify(userResponseBody)
  //       );
  //     }
  //   } else {
  //     //If no auth response or non OK status

  //     //Forward the error stack
  //     let authResponseBody;
  //     if (authResponse) {
  //       authResponseBody = await authResponse.json();
  //     }
  //     return sendJsonResponse(
  //       res,
  //       500,
  //       "No response/invalid response from auth server:",
  //       JSON.stringify(authResponseBody)
  //     );
  //   }
  // } else {
  //   return sendJsonResponse(res, 400, "Missing registration arguments");
  // }
});

module.exports = { registerRouter };
