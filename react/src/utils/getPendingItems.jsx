import axios from "axios";

export default async function getPendingItems(lineID) {
  try {
    //If logged in the JWT should be included automatically
    const response = await axios.get(`/api/lineitem/${lineID}/openitems`);

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
