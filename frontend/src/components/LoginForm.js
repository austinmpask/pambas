import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    credential: "",
    password: "",
  });

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
        navigate("/dashboard");
      }
    } catch (error) {
      //...
    }
  }

  return (
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
          ></input>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-link">
            Login
          </button>
        </div>
        <div className="control">
          <button onClick={handleRegisterClick} className="button is-light">
            Register
          </button>
        </div>
      </div>
    </form>
  );
}
