//React
import { useContext, useEffect, useState } from "react";
import { Spacer } from "@nextui-org/react";

//Contexts
import { UserContext } from "src/context/UserContext";

//Form
import { useForm, useWatch } from "react-hook-form";
import SubmitAlt from "src/components/forms/components/SubmitAlt";
import ControlledInput from "src/components/forms/components/ControlledInput";

//Utils
import { Validators } from "src/utils/validations";

export default function PasswordSettingsForm() {
  const { userData } = useContext(UserContext);

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

  //Watch the values and save to state
  const formValues = useWatch({
    control,
    name: ["oldPassword", "newPassword", "newPasswordConfirm"],
  });
  const [vals, setVals] = useState([]);

  useEffect(() => {
    setVals(formValues);
  }, [formValues]);

  //Make request to update user information
  async function updateData(data) {
    // await toastRequest({
    //   method: "PUT",
    //   route: "/userdata",
    //   data: { first_name: data.firstName, last_name: data.lastName },
    //   setLoading,
    //   success: "Profile updated!",
    //   successCB: (message) => {
    //     //If successful, update user context
    //     reset();
    //     console.log(message.first_name);
    //     setUserData((prev) => ({
    //       ...prev,
    //       firstName: message.first_name,
    //       lastName: message.last_name,
    //     }));
    //   },
    // });
  }
  return (
    <>
      <form onSubmit={handleSubmit((data) => updateData(data))}>
        <ControlledInput
          required
          field="oldPassword"
          errors={errors}
          label="Old Password"
          validations={Validators.Password}
          loading={loading}
          control={control}
          size="s"
          type="password"
        />

        <Spacer y={8} />

        <div className="flex flex-row">
          <ControlledInput
            required
            field="newPassword"
            errors={errors}
            label="New Password"
            validations={Validators.Password}
            loading={loading}
            control={control}
            size="s"
            type="password"
          />

          <Spacer x={4} />

          <ControlledInput
            required
            field="newPasswordConfirm"
            errors={errors}
            label="Confirm New Password"
            validations={Validators.Password}
            loading={loading}
            control={control}
            size="s"
            type="password"
          />
        </div>

        <SubmitAlt
          vals={vals}
          submitLabel="Change Password"
          loading={loading}
        />
      </form>
    </>
  );
}
