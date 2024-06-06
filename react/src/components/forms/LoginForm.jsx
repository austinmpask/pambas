import { useState } from "react";
import handleFormChange from "src/utils/handleFormChange";
import loginUser from "src/utils/loginUser";
import { ToastContainer } from "react-toastify";
import { toastError, toastSuccess } from "src/styles/toasts";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //Save form state
  const [formData, setFormData] = useState({
    credential: "",
    password: "",
  });

  //Wrap generic form helper to include state func
  function handleChange(event) {
    return handleFormChange(event, setFormData);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(formData);
    setLoading(true);

    //Attempt to login the user
    const response = await loginUser(formData);

    //Check for error, forward status to user
    if (!response.ok) {
      setLoading(false);
      response.errors.forEach((error) => {
        toastError(error);
      });
    } else {
      //Successful login, redirect
      toastSuccess("Welcome!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  }

  return (
    <>
      <ToastContainer />

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Login Credential</label>
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
              onClick={() => navigate("/register")}
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
