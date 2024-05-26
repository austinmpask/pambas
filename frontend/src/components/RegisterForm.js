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

  //Temporary error handling for storing errors
  const [errors, setErrors] = useState();

  //Handle when form elements change
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((oldState) => ({ ...oldState, [name]: value }));
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
      //Temporary just forwarding backend errors up
      setErrors(error.response.data.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <span>First Name</span>
      <input
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
      />
      <span>Last Name</span>
      <input
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
      />
      <span>Email</span>
      <input name="email" value={formData.email} onChange={handleChange} />
      <span>Username</span>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <span>Password</span>
      <input
        name="password"
        value={formData.password}
        onChange={handleChange}
        type="password"
      />
      <button type="submit">Register</button>
      {errors && <span>{errors}</span>}
    </form>
  );
}
