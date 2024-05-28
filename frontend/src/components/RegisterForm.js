import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toastSuccess, toastError } from "../assets/styles/toasts";

export default function RegisterForm() {
  const navigate = useNavigate();

  //Track state of form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  //Visuals for loading
  const [loading, setLoading] = useState(false);

  const prettyNames = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    username: "Username",
    password: "Password",
  };

  //Handle when form elements change
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((oldState) => ({ ...oldState, [name]: value }));
  }

  function handleLoginClick(event) {
    event.preventDefault();
    navigate("/login");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const errors = [];
    for (let field in formData) {
      if (!formData[field]) {
        errors.push(prettyNames[field] + " is required!");
      }
    }

    if (errors.length === 0) {
      // Attempt to register the user through gateway
      try {
        const response = await axios.post("/register", {
          username: formData.username,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          password: formData.password,
        });

        if (response.status === 201) {
          //Redirect if successful
          toastSuccess("Success! Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        console.log(error);
        error.response.data.message.includes("Bad response from")
          ? toastError("Username or email already registered!")
          : toastError(error.response.data.message);
        setLoading(false);
      }
    }
    errors.forEach((error) => {
      toastError(error);
      setLoading(false);
    });
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
              onClick={handleLoginClick}
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
