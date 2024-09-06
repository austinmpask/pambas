/*-------------------Cleaned up 9/6/24, needs to be broken up-------------------*/
//React
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Toasts
import { ToastContainer } from "react-toastify";

//Utils
import toastRequest from "../../utils/toastRequest";
import { Validators, DataFields, UIVars } from "src/utils/validations";

//Form
import { useForm, useWatch } from "react-hook-form";
import ControlledInput from "src/components/forms/components/ControlledInput";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

//Children
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Image,
  Spacer,
  Link,
} from "@nextui-org/react";

//Login form
export default function LoginForm() {
  const navigate = useNavigate();

  //Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //Watch values to be passed to child submit button
  const formValues = useWatch({
    control,
    name: ["credential", "password"],
  });

  //Handler for logging in user
  async function login(data) {
    //Make login request, redirect if successful
    await toastRequest({
      method: "POST",
      route: "/login",
      data,
      setLoading,
      error: "Account not found!",
      successCB: () => {
        setTimeout(() => {
          navigate("/dashboard");
        }, UIVars.REDIRECT_DELAY_MS);
      },
    });
  }

  return (
    <>
      <ToastContainer />
      <div className="flex justify-center">
        <Card className="w-full sm:w-[260px] rounded-none sm:rounded-xl">
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
            {/* Form */}
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
                <SubmitAlt
                  vals={formValues}
                  submitLabel="Login"
                  loading={loading}
                />
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
