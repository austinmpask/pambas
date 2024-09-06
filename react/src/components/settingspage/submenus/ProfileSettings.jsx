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
import SubmitAlt from "src/components/forms/components/SubmitAlt";

import PasswordSettingsForm from "src/components/forms/settings/PasswordSettingsForm";
import NameSettingsForm from "src/components/forms/settings/NameSettingsForm";

//Utils
import toastRequest from "src/utils/toastRequest";
import { Validators, DataFields, UIVars } from "src/utils/validations";

//Form for changing user info && viewing login credentials
export default function ProfileSettings() {
  return (
    <>
      <SettingsCard title="Login and Password" icon={faLock}>
        <SettingsCardSection title="Username/Email">
          <UserInfo />
        </SettingsCardSection>

        <SettingsCardSection title="Password">
          <PasswordSettingsForm />
        </SettingsCardSection>
      </SettingsCard>

      <SettingsCard title="Personal Information" icon={faCircleUser} end>
        <SettingsCardSection title="First and Last Name">
          <NameSettingsForm />
        </SettingsCardSection>
      </SettingsCard>
    </>
  );
}
