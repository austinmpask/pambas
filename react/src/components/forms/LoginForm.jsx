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

//Animation
import { motion } from "framer-motion";

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
      error: "Invalid login!",
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
      <div className="h-full w-full flex flex-row justify-center sm:py-12">
        <Card
          isBlurred
          className="w-full sm:w-4/5 lg:w-1/3 rounded-b-3xl rounded-t-none sm:rounded-3xl h-full"
        >
          <CardBody className="h-full p-6 flex flex-col justify-center items-center">
            <div className="flex flex-col items-center gap-10">
              <motion.div
                className="w-[80px] h-[80px]"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{
                  delay: 0.1,
                  duration: 0.7,
                  ease: [0.22, 0.13, 0.16, 1],
                }}
              >
                <Image
                  alt="Logo"
                  height={80}
                  radius="none"
                  src="/rings.png"
                  width={80}
                />
              </motion.div>
              <motion.div
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.3,
                  duration: 1,
                  ease: [0.22, 0.13, 0.16, 1],
                }}
              >
                <p className="text-3xl font-semibold sm:font-bold text-slate-800">
                  Welcome Back!
                </p>
              </motion.div>
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
                  size="m"
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
                  size="m"
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
            </div>
            <div className="flex mt-4">
              <p className="text-sm text-default-500">No account?&nbsp;</p>
              <Link className="text-sm" href="/">
                Sign up
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
