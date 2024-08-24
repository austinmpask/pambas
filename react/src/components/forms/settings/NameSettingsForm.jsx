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
import { useForm, useWatch } from "react-hook-form";
import FormField from "src/components/forms/components/FormField";
import ControlledInput from "src/components/forms/components/ControlledInput";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

//Utils
import toastRequest from "src/utils/toastRequest";
import { Validators, DataFields, UIVars } from "src/utils/validations";

export default function NameSettingsForm() {
  const { userData, setUserData } = useContext(UserContext);

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
    name: ["firstName", "lastName"],
  });
  const [vals, setVals] = useState([]);

  useEffect(() => {
    setVals(formValues);
  }, [formValues]);

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
      {/* <ToastContainer /> */}
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
          <SubmitAlt vals={vals} submitLabel="Save" loading={loading} />
        </div>
      </form>
    </>
  );
}
