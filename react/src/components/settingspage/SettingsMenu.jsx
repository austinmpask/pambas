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
} from "@nextui-org/react";
//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGear,
  faUniversalAccess,
  faCode,
} from "@fortawesome/free-solid-svg-icons";

import ProfileSettings from "src/components/settingspage/submenus/ProfileSettings";

import PreferencesSettings from "src/components/settingspage/submenus/PreferencesSettings";
//Contexts
import { UserContext } from "src/context/UserContext";

//Toasts
import { ToastContainer } from "react-toastify";

//Form
import { useForm } from "react-hook-form";
import FormField from "src/components/forms/components/FormField";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

//Utils
import toastRequest from "src/utils/toastRequest";
import { Validators, DataFields, UIVars } from "src/utils/validations";

//Form for changing user info && viewing login credentials
export default function SettingsMenu() {
  //Subscribe to user context
  const { userData, setUserData } = useContext(UserContext);

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //Form setup
  const { control, handleSubmit, reset } = useForm();

  //Whenever user data is updated, reset the form
  useEffect(() => {
    reset();
  }, [userData]);

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

  const tabs = [
    {
      id: "account",
      label: "Profile",
      content: <ProfileSettings />,
      icon: <FontAwesomeIcon icon={faUser} />,
    },
    {
      id: "preferences",
      label: "Preferences",
      content: <PreferencesSettings />,
      icon: <FontAwesomeIcon icon={faGear} />,
    },
    {
      id: "accessibility",
      label: "Accessibility",
      content: "access stuff",
      icon: <FontAwesomeIcon icon={faUniversalAccess} />,
    },
    {
      id: "advanced",
      label: "Advanced Settings",
      content: "",
      icon: <FontAwesomeIcon icon={faCode} />,
    },
  ];

  return (
    <>
      <ToastContainer />
      <Tabs isVertical variant="light" aria-label="Settings tabs" items={tabs}>
        {(item) => (
          <Tab
            className="min-w-fit max-w-full"
            key={item.id}
            title={
              <div className="flex w-[150px] flex-row justify-start items-center space-x-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
            }
          >
            {item.content}
          </Tab>
        )}
      </Tabs>
    </>
  );
}
