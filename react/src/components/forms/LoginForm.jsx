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
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@nextui-org/react";

//NextUI

//Login form
export default function LoginForm() {
  const navigate = useNavigate();

  //Form setup
  const { control, handleSubmit } = useForm();

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
      <div className="flex justify-center">
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <Image
              alt="Logo"
              height={40}
              radius="sm"
              src="/logorings.png"
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-lg font-bold">Welcome Back!</p>
              <p className="text-small text-default-500">
                Don't have an account? Sign up
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <form
              className="box container fit-box flex flex-col items-center"
              onSubmit={handleSubmit((data) => login(data))}
            >
              <FormField
                field="credential"
                label={DataFields.CRED_LABEL}
                validations={Validators.LoginCredential}
                loading={loading}
                size="ff-med"
                control={control}
              />
              <FormField
                field="password"
                label={DataFields.PASS_LABEL}
                validations={Validators.Password}
                loading={loading}
                size="ff-med"
                control={control}
                type="password"
              />
              <div className="w-full pl-1">
                <SubmitAlt
                  submitLabel="Login"
                  altLabel="Sign Up"
                  altAction={() => navigate("/register")}
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
