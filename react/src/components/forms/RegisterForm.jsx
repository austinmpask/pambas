/*-------------------Cleaned up 9/6/24, needs to be broken up-------------------*/
//React
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Toasts
import { ToastContainer } from "react-toastify";

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
        })
      : toastError("Passwords must match"); //Password mismatch
  }

  return (
    <>
      <ToastContainer />

      <div className="flex justify-center">
        <Card className="rounded-none sm:rounded-xl">
          <CardHeader className="flex gap-3">
            <Image
              alt="Logo"
              height={40}
              radius="sm"
              src="/rings.png"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-lg font-bold">Register</p>
              <div className="flex">
                <p className="text-small text-default-500">
                  Have an account?&nbsp;
                </p>
                <Link className="text-small" href="/login">
                  Login
                </Link>
              </div>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className="p-6">
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
                    label="Confirm New Password"
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
          </CardBody>
        </Card>
      </div>
    </>
  );
}
