import axios from "axios";

export default async function getProject(id) {
  try {
    //If logged in the JWT should be included automatically
    const response = await axios.get(`/api/project/${id}`);

    //User was authenticated, data rec.
    if (response.status === 200) {
      const data = JSON.parse(response.data.message);

      //Return project data
      return {
        ok: true,
        data,
      };
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return { ok: false };
}
