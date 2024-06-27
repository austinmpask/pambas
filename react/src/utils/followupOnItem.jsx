import axios from "axios";

export default async function followupOnItem(id) {
  try {
    //If logged in the JWT should be included automatically
    const response = await axios.put(`/api/openitem/${id}/followup`);

    //User was authenticated, data rec.
    if (response.status === 200) {
      const data = response.data.message;

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
