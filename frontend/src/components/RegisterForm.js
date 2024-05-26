import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        navigate("/login");
      }
    } catch (error) {
      //...
    }
  }

  return (
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
          ></input>
        </div>
      </div>

      <div className="field">
        <label className="label">Password</label>
        <div className="control mb-3">
          <input
            className="input"
            type="text"
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
            Register
          </button>
        </div>
        <div className="control">
          <button onClick={handleLoginClick} className="button is-light">
            Login
          </button>
        </div>
      </div>
    </form>
  );
}
