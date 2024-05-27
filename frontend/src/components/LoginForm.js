import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../assets/styles/toasts";
import { ToastContainer } from "react-toastify";

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    credential: "",
    password: "",
  });

  //Visuals for loading
  const [loading, setLoading] = useState(false);

  //Handle when form elements change
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((oldState) => ({ ...oldState, [name]: value }));
  }

  function handleRegisterClick(event) {
    event.preventDefault();
    navigate("/register");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const errors = [];
    for (let field in formData) {
      if (!formData[field]) {
        errors.push(field[0].toUpperCase() + field.slice(1) + " is required!");
      }
    }

    if (errors.length === 0) {
      //Prepare request body to auth API
      const payload = {
        password: formData.password,
      };

      //Roughly determine if credential is username or email. Auth API expects labeled request
      if (
        formData.credential.includes("@") &&
        formData.credential.includes(".")
      ) {
        payload.email = formData.credential;
      } else {
        payload.username = formData.credential;
      }

      //Login the user, save the JWT
      try {
        const response = await axios.post("/auth/login", payload);

        if (response.status === 200) {
          toastSuccess("Welcome!");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      } catch (error) {
        toastError("Invalid Login!");
        setLoading(false);
      }
    } else {
      errors.forEach((error) => {
        toastError(error);
        setLoading(false);
      });
    }
  }

  return (
    <>
      <ToastContainer />

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Login</label>
          <div className="control mb-3">
            <input
              className="input"
              type="text"
              placeholder="Username/Email"
              name="credential"
              value={formData.credential}
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
              Login
            </button>
          </div>
          <div className="control">
            <button
              onClick={handleRegisterClick}
              className="button is-light"
              disabled={loading}
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
