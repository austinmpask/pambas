import axios from "axios";

//Update a line item in the DB when user interacts
export default async function updateLineItem(id, lineState) {
  try {
    const apiResponse = await axios.put(`/api/lineitem/${id}`, lineState);

    if (apiResponse && apiResponse.status === 200) {
      return { ok: true };
    }
  } catch (error) {
    return {
      ok: false,
      error: `Internal error while updating database: ${error}`,
    };
  }
}
