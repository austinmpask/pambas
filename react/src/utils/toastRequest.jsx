//Utils
import makeRequest from "src/utils/makeRequest";
//Toasts
import { toastError, toastSuccess } from "src/styles/toasts";

//Handle an api request where a toast popup will be the feedback to the user.
//Can take a callback for error or success where the api response will be used as the argument
export default async function toastRequest({
  method,
  route,
  data = undefined,
  success = "Success!",
  setLoading = (loading) => {},
  error = undefined,
  successCB = undefined,
  errorCB = undefined,
}) {
  //Set the loading state of the parent form
  setLoading(true);

  //Make the specified api request
  const response = await makeRequest(method, route, data);

  //Handle cases of success or error, and execute callbacks if provided
  if (response.ok) {
    toastSuccess(success);
    successCB && successCB(response.message);
  } else {
    toastError(error || `Internal error: ${response.message}`);
    errorCB && errorCB(response.message);
  }

  //Resume loading state to false
  setLoading(false);

  //Return the api response incase it is needed in the parent outside of using a callback
  return response;
}
