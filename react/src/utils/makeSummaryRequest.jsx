import axios from "axios";

//TODO: Combine into a generic api req helper

//Helper to set context
export default async function makeSummaryRequest() {
  try {
    //If logged in the JWT should be included automatically
    const response = await axios.get("/api/project");

    //User was authenticated, data rec.
    const data = JSON.parse(response.data.message);
    if (data.status === 200) {
      //Return project data for context
      return {
        ok: true,
        data,
      };
    }
  } catch (error) {
    if (error.response.status === 404) {
      return { ok: false, status: 404 };
    } else {
      console.error(`Error: ${error}`);
    }
  }
  //Redirect to login if no JWT
  return { ok: false, status: 400 };
}
