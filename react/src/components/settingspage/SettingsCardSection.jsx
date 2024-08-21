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
} from "@fortawesome/free-solid-svg-icons";

import ProfileSettings from "src/components/settingspage/submenus/ProfileSettings";

import SettingsCard from "src/components/settingspage/SettingsCard";

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

export default function SettingsCardSection({ title, children = null }) {
  return (
    <>
      <p className="text-md font-semibold">{title}</p>
      <Spacer y={4} />

      <div className="flex flex-row">
        <Spacer x={4} />

        <div className="flex flex-col">{children}</div>
      </div>
    </>
  );
}
