import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
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

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.put("/userdata", {
        first_name: formData.firstName,
        last_name: formData.lastName,
      });

      if (response && response.status === 200) {
        console.log("good");

        //Update context
        setUserData((previousContext) => ({
          ...previousContext,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
        }));
      }
    } catch {
      console.log("broke");
    }
  }

  return (
    <>
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

          <div className="field">
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
          <button className="button is-dark" type="submit">
            Save Changes
          </button>
          <button className="button">Discard</button>
        </form>
      </section>
    </>
  );
}
