//React
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Toasts
import { ToastContainer } from "react-toastify";
import { toastError, toastSuccess } from "src/styles/toasts";

//Utils
import handleFormChange from "src/utils/handleFormChange";
import registerUser from "src/utils/registerUser";

//User registration form
export default function RegisterForm() {
  const navigate = useNavigate();

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //Track state of form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  //Formatted field names for error messages
  const prettyNames = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    username: "Username",
    password: "Password",
  };

  //Wrap generic form helper to include state func
  function handleChange(event) {
    return handleFormChange(event, setFormData);
  }

  //Submit form and register user
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    //Attempt to register the user
    const response = await registerUser(formData, prettyNames);

    //Check for error, forward status to user
    if (!response.ok) {
      setLoading(false);
      response.errors.forEach((error) => {
        toastError(error);
      });
    } else {
      //Successful registration, redirect
      toastSuccess("Success! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">First Name</label>
          <div className="control mb-3">
            <input
              className="input"
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
            ></input>
          </div>
        </div>

        <div className="field">
          <label className="label">Last Name</label>
          <div className="control mb-3">
            <input
              className="input"
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
            ></input>
          </div>
        </div>

        <div className="field">
          <label className="label">Email</label>
          <div className="control mb-3">
            <input
              className="input"
              type="text"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            ></input>
          </div>
        </div>

        <div className="field">
          <label className="label">Username</label>
          <div className="control mb-3">
            <input
              className="input"
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            ></input>
          </div>
        </div>

        <div className="field">
          <label className="label">Password</label>
          <div className="control mb-3">
            <input
              className="input"
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            ></input>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className={`button is-link ${loading && " is-loading"}`}
              disabled={loading}
            >
              Register
            </button>
          </div>
          <div className="control">
            <button
              onClick={() => navigate("/login")}
              className="button is-light"
              disabled={loading}
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
