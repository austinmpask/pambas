import axios from "axios";

export default async function makeAuthRequest() {
  try {
    //If logged in the JWT should be included automatically
    const response = await axios.get("/api/userdata");

    //User was authenticated, data rec.
    if (response.status === 200) {
      const dataObj = JSON.parse(response.data.message);

      //Return user data for context
      return {
        ok: true,
        data: {
          firstName: dataObj.first_name,
          lastName: dataObj.last_name,
          email: dataObj.email,
          username: dataObj.username,
        },
      };
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  //Redirect to login if no JWT
  return { ok: false };
}
