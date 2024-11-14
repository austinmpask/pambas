/*-------------------Cleaned up 9/6/24-------------------*/
//React
import { useContext, useState } from "react";

//Children
import { Spacer } from "@nextui-org/react";

//Contexts
import { UserContext } from "src/context/UserContext";

//Form
import { useForm, useWatch } from "react-hook-form";
import ControlledInput from "src/components/forms/components/ControlledInput";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

//Toasts
import { ToastContainer } from "react-toastify";

//Utils
import toastRequest from "src/utils/toastRequest";
import { Validators, DataFields } from "src/utils/validations";

//Settings menu form for user to change first and or last name
export default function NameSettingsForm() {
  //Consume user context
  const { userData, setUserData } = useContext(UserContext);

  //Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //Watch required values and pass to submit button
  const formValues = useWatch({
    control,
    name: ["firstName", "lastName"],
  });

  //Make request to update user information
  async function updateData(data) {
    await toastRequest({
      method: "PUT",
      route: "/userdata",
      data: {
        ...userData,
        first_name: data.firstName,
        last_name: data.lastName,
      },
      setLoading,
      success: "Profile updated!",
      successCB: (message) => {
        //If successful, update user context
        setUserData((prev) => ({
          ...prev,
          firstName: message.first_name,
          lastName: message.last_name,
        }));
      },
    });
    reset();
  }

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit((data) => updateData(data))}>
        <ControlledInput
          required
          field="firstName"
          errors={errors}
          label={DataFields.FIRST_NAME_LABEL}
          placeholder={userData.firstName}
          validations={Validators.FirstName}
          loading={loading}
          control={control}
          size="s"
        />

        <Spacer y={4} />

        <ControlledInput
          required
          field="lastName"
          errors={errors}
          label={DataFields.LAST_NAME_LABEL}
          placeholder={userData.lastName}
          validations={Validators.LastName}
          loading={loading}
          control={control}
          size="s"
        />

        <div className="w-full mt-6 sm:mt-0 sm:w-fit">
          <SubmitAlt vals={formValues} submitLabel="Save" loading={loading} />
        </div>
      </form>
    </>
  );
}
