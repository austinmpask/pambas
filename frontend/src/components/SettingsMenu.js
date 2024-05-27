import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { ToastContainer } from "react-toastify";
import { toastSuccess } from "../assets/styles/toasts";

import axios from "axios";

export default function SettingsMenu() {
  const { userData, setUserData } = useContext(UserContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  function handleChange(event) {
    event.preventDefault();

    const { name, value } = event.target;

    setFormData((previousState) => ({
      ...previousState,
      [name]: value,
    }));
  }

  function handleDiscard(event) {
    event.preventDefault();
    setFormData({ firstName: "", lastName: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
      };

      const response = await axios.put("/userdata", payload);

      if (response && response.status === 200) {
        const responseData = JSON.parse(response.data.message);
        //Update context
        setUserData((previousContext) => ({
          ...previousContext,
          firstName: responseData.first_name || previousContext.firstName,
          lastName: responseData.last_name || previousContext.lastName,
        }));
        toastSuccess("Profile Updated!");

        //Reset form
        setFormData({ firstName: "", lastName: "" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <ToastContainer />
      <h2 className="subtitle">Account Options</h2>

      <section className="section settings-form">
        <form onSubmit={handleSubmit}>
          <div className="block mb-2">
            <span className="icon-text">
              <span className="icon">
                <i className="fas fa-lock"></i>
              </span>
              <span>{userData.username}</span>
            </span>
          </div>
          <div className="block mb-5">
            <span className="icon-text">
              <span className="icon">
                <i className="fas fa-lock"></i>
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
              ></input>
            </div>
          </div>
          <div className="block mt-3">
            <button
              className={`mr-3 button ${
                formData.firstName === "" && formData.lastName === ""
                  ? "is-dark"
                  : "is-link"
              }`}
              type="submit"
            >
              Save Changes
            </button>
            <button className="button" onClick={handleDiscard}>
              Discard
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
