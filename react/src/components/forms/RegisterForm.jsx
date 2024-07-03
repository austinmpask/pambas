//React
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Toasts
import { ToastContainer } from "react-toastify";

//Form
import { useForm } from "react-hook-form";
import FormField from "../forms/components/FormField";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

import { Validators, DataFields } from "../../utils/validations";
import toastRequest from "../../utils/toastRequest";

//User registration form
export default function RegisterForm() {
  const navigate = useNavigate();

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //Submit form and register user
  async function registerUser(data) {
    await toastRequest({
      method: "POST",
      route: "/register",
      data,
      setLoading,
      success: "Success! Redirecting to login...",
      successCB: () => {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      },
    });
  }

  return (
    <>
      <ToastContainer />
      <form
        className="box container fit-box"
        onSubmit={handleSubmit((data) => registerUser(data))}
      >
        <h2 className="title is-4 has-text-weight-bold mb-5">
          Personal Information
        </h2>
        <div className="m-4">
          <div className="inline">
            <div className="mr-6">
              <FormField
                field="firstName"
                error={errors.firstName?.message}
                label={DataFields.FIRST_NAME_LABEL}
                validations={Validators.FirstName}
                loading={loading}
                register={register}
              />
            </div>

            <FormField
              field="lastName"
              error={errors.lastName?.message}
              label={DataFields.LAST_NAME_LABEL}
              validations={Validators.LastName}
              loading={loading}
              register={register}
            />
          </div>
          <FormField
            field="email"
            error={errors.email?.message}
            label={DataFields.EMAIL_LABEL}
            validations={Validators.Email}
            loading={loading}
            size=""
            register={register}
          />
        </div>

        <h2 className="title is-4 has-text-weight-bold mb-5">
          Login Information
        </h2>
        <div className="m-4">
          <FormField
            field="username"
            error={errors.username?.message}
            label={DataFields.USER_LABEL}
            validations={Validators.Username}
            loading={loading}
            size="ff-med"
            register={register}
          />

          <FormField
            field="password"
            error={errors.password?.message}
            label={DataFields.PASS_LABEL}
            validations={Validators.Password}
            loading={loading}
            type="password"
            size="ff-med"
            register={register}
          />

          <FormField
            field="passwordConfirm"
            error={errors.passwordConfirm?.message}
            label={"Confirm Password"}
            validations={Validators.Password}
            loading={loading}
            type="password"
            size="ff-med"
            register={register}
          />
        </div>

        <SubmitAlt
          submitLabel="Register"
          altLabel="Login Instead"
          altAction={() => navigate("/login")}
          loading={loading}
        />
      </form>
    </>
  );
}
