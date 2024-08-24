//React
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//Toasts
import { ToastContainer } from "react-toastify";

//Form
import { useForm, useWatch } from "react-hook-form";
import FormField from "../forms/components/FormField";
import SubmitAlt from "src/components/forms/components/SubmitAlt";
import ControlledInput from "src/components/forms/components/ControlledInput";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Spacer,
  Link,
  Tooltip,
} from "@nextui-org/react";

import { Validators, DataFields } from "../../utils/validations";
import toastRequest from "../../utils/toastRequest";

//User registration form
export default function RegisterForm() {
  const navigate = useNavigate();

  //Form setup
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  const formValues = useWatch({
    control,
    name: [
      "firstName",
      "lastName",
      "email",
      "username",
      "password",
      "confirmPassword",
    ],
  });
  const [vals, setVals] = useState([]);

  useEffect(() => {
    setVals(formValues);
  }, [formValues]);

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

              <SubmitAlt vals={vals} submitLabel="Register" loading={loading} />
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
