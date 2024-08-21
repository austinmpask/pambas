//React
import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Tabs,
  Tab,
  Spacer,
} from "@nextui-org/react";
//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGear,
  faUniversalAccess,
  faCode,
  faCircleUser,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

//Contexts
import { UserContext } from "src/context/UserContext";

//Toasts
import { ToastContainer } from "react-toastify";

import SettingsCard from "src/components/settingspage/SettingsCard";
import SettingsCardSection from "src/components/settingspage/SettingsCardSection";
import UserInfo from "src/components/settingspage/UserInfo";

//Form
import { useForm } from "react-hook-form";
import FormField from "src/components/forms/components/FormField";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

//Utils
import toastRequest from "src/utils/toastRequest";
import { Validators, DataFields, UIVars } from "src/utils/validations";

export default function PasswordSettingsForm() {
  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  const { userData } = useContext(UserContext);

  //Form setup
  const { control, handleSubmit, reset } = useForm();

  //Make request to update user information
  async function updateData(data) {
    await toastRequest({
      method: "PUT",
      route: "/userdata",
      data: { first_name: data.firstName, last_name: data.lastName },
      setLoading,
      success: "Profile updated!",
      successCB: (message) => {
        //If successful, update user context
        reset();
        console.log(message.first_name);
        setUserData((prev) => ({
          ...prev,
          firstName: message.first_name,
          lastName: message.last_name,
        }));
      },
    });
  }
  return (
    <>
      <form onSubmit={handleSubmit((data) => updateData(data))}>
        <FormField
          field="oldPassword"
          label={"Old Password"}
          placeHolder="Enter your current password"
          validations={Validators.PASSWORD}
          loading={loading}
          control={control}
        />

        <Spacer y={4} />

        <div className="flex flex-row">
          <FormField
            field="newPasswordOne"
            label={"New Password"}
            placeHolder="Enter a new password"
            validations={Validators.PASSWORD}
            loading={loading}
            control={control}
          />

          <Spacer x={4} />

          <FormField
            field="newPasswordTwo"
            label={"Confirm New Password"}
            placeHolder="Retype your new password"
            validations={Validators.PASSWORD}
            loading={loading}
            control={control}
          />
        </div>

        <SubmitAlt
          submitLabel="Change Password"
          altLabel="Discard"
          altAction={() => {
            reset();
          }}
          loading={loading}
        />
      </form>
    </>
  );
}
