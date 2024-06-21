import axios from "axios";

//TODO: Combine into a generic api req helper

//Helper to set context
export default async function makeSummaryRequest() {
  try {
    //If logged in the JWT should be included automatically
    const response = await axios.get("/api/allprojects");

    //User was authenticated, data rec.
    if (response.status === 200) {
      const data = JSON.parse(response.data.message);

      //Return project data for context
      return {
        ok: true,
        data,
      };
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  //Redirect to login if no JWT
  return { ok: false };
}
