/*-------------------Cleaned up 9/6/24, needs to be broken up-------------------*/
//React
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Toasts
import { ToastContainer } from "react-toastify";

//Animation
import { motion } from "framer-motion";

//Form
import { useForm, useWatch } from "react-hook-form";
import SubmitAlt from "src/components/forms/components/SubmitAlt";
import ControlledInput from "src/components/forms/components/ControlledInput";

//Children
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Image,
  Spacer,
  Link,
  Tooltip,
} from "@nextui-org/react";

//Utils
import { Validators, DataFields } from "src/utils/validations";
import toastRequest from "src/utils/toastRequest";

//Toasts
import { toastError } from "src/styles/toasts";

//User registration form
export default function RegisterForm() {
  const navigate = useNavigate();

  //Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //Watch required fields for passing to child button
  const formValues = useWatch({
    control,
    name: [
      "firstName",
      "lastName",
      "email",
      "username",
      "password",
      "passwordConfirm",
    ],
  });

  //Submit form and register user
  async function registerUser(data) {
    //Make sure that confirmed password matches original
    data.password === data.passwordConfirm
      ? await toastRequest({
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
          error: "Invalid/unavailable username or email",
        })
      : toastError("Passwords must match"); //Password mismatch
  }

  return (
    <>
      <ToastContainer />

      <div className="h-full lg:py-12">
        <Card
          isBlurred
          className="w-full rounded-none lg:rounded-l-3xl lg:rounded-r-none h-full"
        >
          <CardBody className="h-full p-6 flex flex-col justify-center items-center">
            <div className="flex flex-col items-center gap-10">
              <p className="text-3xl font-semibold w-full text-slate-800">
                Create an Account
              </p>

              <form
                className="flex flex-col items-start"
                onSubmit={handleSubmit((data) => registerUser(data))}
              >
                <p className="text-l font-semibold">Personal Information</p>
                <Spacer y={4} />

                <div className="flex flex-row">
                  <ControlledInput
                    required
                    field="firstName"
                    errors={errors}
                    label={DataFields.FIRST_NAME_LABEL}
                    validations={Validators.FirstName}
                    loading={loading}
                    control={control}
                    size="s"
                    type="text"
                  />
                  <Spacer x={4} />

                  <ControlledInput
                    required
                    field="lastName"
                    errors={errors}
                    label={DataFields.LAST_NAME_LABEL}
                    validations={Validators.LastName}
                    loading={loading}
                    control={control}
                    size="s"
                    type="text"
                  />
                </div>

                <Spacer y={4} />

                <ControlledInput
                  required
                  field="email"
                  errors={errors}
                  label={DataFields.EMAIL_LABEL}
                  validations={Validators.Email}
                  loading={loading}
                  control={control}
                  size="l"
                  type="text"
                />

                <Spacer y={8} />

                <p className="text-l font-semibold">Account Credentials</p>
                <Spacer y={4} />
                <ControlledInput
                  required
                  field="username"
                  errors={errors}
                  label={DataFields.USER_LABEL}
                  validations={Validators.Username}
                  loading={loading}
                  control={control}
                  size="l"
                  type="text"
                />
                <Spacer y={4} />

                <Tooltip
                  delay={250}
                  className="px-6"
                  placement="right"
                  content={
                    <div className="px-1 py-2">
                      <div className="text-small font-bold">
                        Password Requirements
                      </div>

                      <ul className="list-disc">
                        <li className="text-tiny">Atleast 8 characters</li>
                        <li className="text-tiny">
                          Contains both letters and numbers
                        </li>
                        <li className="text-tiny">
                          Contains special character (!@#$... etc.)
                        </li>
                      </ul>
                    </div>
                  }
                >
                  <div className="flex flex-row">
                    <ControlledInput
                      required
                      field="password"
                      errors={errors}
                      label={DataFields.PASS_LABEL}
                      validations={Validators.Password}
                      loading={loading}
                      control={control}
                      size="s"
                      type="password"
                    />

                    <Spacer x={4} />

                    <ControlledInput
                      required
                      field="passwordConfirm"
                      errors={errors}
                      label="Confirm Password"
                      validations={Validators.Password}
                      loading={loading}
                      control={control}
                      size="s"
                      type="password"
                    />
                  </div>
                </Tooltip>
                <Spacer y={4} />

                <SubmitAlt
                  vals={formValues}
                  submitLabel="Register"
                  loading={loading}
                />
              </form>

              <div className="flex mt-4">
                <p className="text-sm text-default-500">
                  Already a member?&nbsp;
                </p>
                <Link className="text-sm" href="/login">
                  Login
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
