//React
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Toasts
import { ToastContainer } from "react-toastify";
import { toastError, toastSuccess } from "src/styles/toasts";

//Utils
import loginUser from "src/utils/loginUser";
import { useForm } from "react-hook-form";
import FormField from "src/components/forms/components/FormField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExclamationCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import SubmitAlt from "./components/SubmitAlt";
import { Validators } from "../../utils/validations";
import { DataFields } from "../../utils/validations";

//Login form
export default function LoginForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  async function login(data) {
    console.log(data);
    // event.preventDefault();
    // setLoading(true);
    // //Attempt to login the user
    // const response = await loginUser(formData);
    // //Check for error, forward status to user
    // if (!response.ok) {
    //   setLoading(false);
    //   response.errors.forEach((error) => {
    //     toastError(error);
    //   });
    // } else {
    //   //Successful login, redirect
    //   toastSuccess("Welcome!");
    //   setTimeout(() => {
    //     navigate("/dashboard");
    //   }, 2000);
    // }
  }

  return (
    <>
      <ToastContainer />

      <form onSubmit={handleSubmit((data) => login(data))}>
        <div className="mb-2 login-field">
          <FormField
            field="credential"
            error={errors.credential?.message}
            label={DataFields.CRED_LABEL}
            validations={Validators.LoginCredential}
            loading={loading}
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
            register={register}
          />
        </div>
        <SubmitAlt
          submitLabel="Login"
          altLabel="Register"
          altAction={() => navigate("/register")}
          loading={loading}
        />
      </form>
    </>
  );
}
