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
      console.log("someting wong");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Username/email</p>
      <input
        name="credential"
        value={formData.credential}
        onChange={handleChange}
      ></input>
      <p>Password</p>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      ></input>
      <button type="submit">Login</button>
    </form>
  );
}
