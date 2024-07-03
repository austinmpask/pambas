import axios from "axios";

//Make api requests and handle errors
export default async function makeRequest(
  method = "GET",
  route,
  data = undefined
) {
  //Choose axios method
  const methods = {
    GET: axios.get,
    POST: axios.post,
    PUT: axios.put,
    DELETE: axios.delete,
  };
  const req = methods[method];

  //Attempt to make request
  const okCodes = new Set([200, 201]);
  let ok = false;

  try {
    const apiResponse = await req(`/api/${route}`, data);

    //Successful response, no errors
    ok = apiResponse && okCodes.has(apiResponse.status);

    //Send back to parent in standard format
    return {
      ok,
      status: apiResponse.status,
      message: apiResponse.data.message,
    };
  } catch (e) {
    return {
      ok,
      status: e.response.data.code,
      message: e.response.data.message,
    };
  }
}
