import axios from "axios";

export default async function putOpenItem(formData, itemID) {
  let errors = [];

  try {
    const apiResponse = await axios.put(`/api/openitem/${itemID}`, {
      ...formData,
    });

    //Successfully edit open item
    if (apiResponse && apiResponse.status === 200) {
      //Forward
      return {
        ok: true,
        data: apiResponse.data.message,
      };
    }
  } catch (error) {
    errors = [`Internal error while editing open item: ${error}`];
    return {
      ok: false,
      errors,
    };
  }

  //Catch all incase something else does not work
  return {
    ok: false,
    errors: ["Bad API reponse while editing open item, try again later"],
  };
}
