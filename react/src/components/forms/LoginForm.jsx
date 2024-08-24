//React
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//Toasts
import { ToastContainer } from "react-toastify";

//Utils
import toastRequest from "../../utils/toastRequest";
import { Validators, DataFields } from "src/utils/validations";

import ControlledInput from "src/components/forms/components/ControlledInput";

//Form
import { useForm, useWatch } from "react-hook-form";
import FormField from "src/components/forms/components/FormField";
import SubmitAlt from "src/components/forms/components/SubmitAlt";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Spacer,
  Link,
} from "@nextui-org/react";

//NextUI

//Login form
export default function LoginForm() {
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
    name: ["credential", "password"],
  });
  const [vals, setVals] = useState([]);

  useEffect(() => {
    setVals(formValues);
  }, [formValues]);

  //Handler for logging in user
  async function login(data) {
    //Make login request, redirect if successful
    await toastRequest({
      method: "POST",
      route: "/login",
      data,
      error: "Account not found!",
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
      <div className="flex justify-center">
        <Card className="w-full sm:w-[260px]">
          <CardHeader className="flex gap-3">
            <Image
              alt="Logo"
              height={40}
              radius="sm"
              src="/rings.png"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-lg font-bold">Welcome Back!</p>
              <div className="flex">
                <p className="text-small text-default-500">No account?&nbsp;</p>
                <Link className="text-small" href="/register">
                  Sign up
                </Link>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="mt-6 sm:mt-0 p-6">
            <form
              className="flex flex-col items-center"
              onSubmit={handleSubmit((data) => login(data))}
            >
              <ControlledInput
                required
                field="credential"
                errors={errors}
                label={DataFields.CRED_LABEL}
                validations={Validators.LoginCredential}
                loading={loading}
                control={control}
                size="s"
                type="text"
              />

              <Spacer y={4} />

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

              <div className="w-full mt-6 sm:mt-0 sm:w-[200px]">
                <SubmitAlt vals={vals} submitLabel="Login" loading={loading} />
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
