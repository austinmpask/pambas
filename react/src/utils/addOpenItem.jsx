import axios from "axios";

export default async function addOpenItem(formData, lineID) {
  let errors = [];

  try {
    const apiResponse = await axios.post("/api/openitem", {
      ...formData,
      lineID,
    });

    //Successfully added open item
    if (apiResponse && apiResponse.status === 201) {
      //Forward
      return {
        ok: true,
        data: apiResponse.data.message,
      };
    }
  } catch (error) {
    errors = [`Internal error while adding open item: ${error}`];
    return {
      ok: false,
      errors,
    };
  }

  //Catch all incase something else does not work
  return {
    ok: false,
    errors: ["Bad API reponse while adding open item, try again later"],
  };
}
