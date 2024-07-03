//React
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Toasts
import { ToastContainer } from "react-toastify";

//Utils
import toastRequest from "../../utils/toastRequest";
import { Validators, DataFields } from "src/utils/validations";

//Form
import { useForm } from "react-hook-form";
import FormField from "src/components/forms/components/FormField";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

//Login form
export default function LoginForm() {
  const navigate = useNavigate();

  //Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //Handler for logging in user
  async function login(data) {
    //Make login request, redirect if successful
    await toastRequest({
      method: "POST",
      route: "/login",
      data,
      setLoading,
      successCB: () => {
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      },
    });
  }

  return (
    <>
      <ToastContainer />
      <form
        className="box container fit-box"
        onSubmit={handleSubmit((data) => login(data))}
      >
        <h2 className="title is-4 has-text-weight-bold mb-5">Login</h2>
        <div className="m-4">
          <div className="mb-2 login-field">
            <FormField
              field="credential"
              error={errors.credential?.message}
              label={DataFields.CRED_LABEL}
              validations={Validators.LoginCredential}
              loading={loading}
              size="ff-med"
              register={register}
            />
          </div>

          <div className="login-bottom login-field">
            <FormField
              field="password"
              error={errors.password?.message}
              label={DataFields.PASS_LABEL}
              validations={Validators.Password}
              loading={loading}
              size="ff-med"
              register={register}
              type="password"
            />
          </div>
          <SubmitAlt
            submitLabel="Login"
            altLabel="Register"
            altAction={() => navigate("/register")}
            loading={loading}
          />
        </div>
      </form>
    </>
  );
}
