//React
import { useContext, useState } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

//Contexts
import { UserContext } from "src/context/UserContext";

//Toasts
import { ToastContainer } from "react-toastify";
import { toastSuccess, toastError } from "src/styles/toasts";

//Utils
import handleFormChange from "src/utils/handleFormChange";
import updateUserInfo from "src/utils/updateUserInfo";

//Form for changing user info && viewing login credentials
export default function SettingsForm() {
  const { userData, setUserData } = useContext(UserContext);

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //Track state of form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  //Formatted form names for error messages
  const prettyNames = {
    firstName: "First Name",
    lastName: "Last Name",
  };

  //Wrap generic form helper to include state func
  function handleChange(event) {
    return handleFormChange(event, setFormData);
  }

  //Reset the form helper
  function clearForm() {
    setFormData({ firstName: "", lastName: "" });
  }

  //Reset form if user chooses so
  function handleDiscard(event) {
    event.preventDefault();
    clearForm();
  }

  //Submit form and update user info
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    //Attempt to update the user's information
    const response = await updateUserInfo(formData, prettyNames);

    //Check for error, forward status to user
    if (!response.ok) {
      response.errors.forEach((error) => {
        toastError(error);
      });
    } else {
      //Update context based on response
      setUserData((previous) => ({
        ...previous,
        firstName: response.firstName || previous.firstName,
        lastName: response.lastName || previous.lastName,
      }));
      //Reset the form so that they can see the change and provide feedback to user
      clearForm();
      toastSuccess("Name successfully updated!");
    }
    setLoading(false);
  }

  return (
    <>
      <ToastContainer />
      <h2 className="subtitle">Account Options</h2>

      <section className="section application-form">
        <form onSubmit={handleSubmit}>
          <div className="block mb-2">
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <span>{userData.username}</span>
            </span>
          </div>
          <div className="block mb-5">
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <span>{userData.email}</span>
            </span>
          </div>

          <div className="field mb-3">
            <label className="label">First Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="firstName"
                placeholder={userData.firstName}
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
              ></input>
            </div>
          </div>

          <div className="field">
            <label className="label">Last Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="lastName"
                placeholder={userData.lastName}
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
              ></input>
            </div>
          </div>
          <div className="block mt-3">
            <button
              className={`mr-3 button ${
                !formData.firstName && !formData.lastName
                  ? "is-dark"
                  : "is-link"
              } ${loading && "is-loading"}`}
              type="submit"
              disabled={(!formData.firstName && !formData.lastName) || loading}
            >
              Save Changes
            </button>
            <button
              className="button"
              onClick={handleDiscard}
              disabled={(!formData.firstName && !formData.lastName) || loading}
            >
              Discard
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
