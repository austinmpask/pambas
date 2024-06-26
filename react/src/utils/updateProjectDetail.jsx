import axios from "axios";

//Update a line item in the DB when user interacts
export default async function updateProjectDetail(id, projectState) {
  try {
    const apiResponse = await axios.put(`/api/project/${id}`, projectState);

    if (apiResponse && apiResponse.status === 200) {
      const message = JSON.parse(apiResponse.data.message);
      return { ok: true, data: message };
    }
  } catch (error) {
    return {
      ok: false,
      error: `Internal error while updating database: ${error}`,
    };
  }
}
