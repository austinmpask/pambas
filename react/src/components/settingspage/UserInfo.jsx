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
  Tooltip,
} from "@nextui-org/react";
//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

//Contexts
import { UserContext } from "src/context/UserContext";

//Toasts
import { ToastContainer } from "react-toastify";

import SettingsCard from "src/components/settingspage/SettingsCard";

//Form
import { useForm } from "react-hook-form";
import FormField from "src/components/forms/components/FormField";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

//Utils
import toastRequest from "../../utils/toastRequest";
import { Validators, DataFields, UIVars } from "../../utils/validations";

export default function UserInfo() {
  const { userData } = useContext(UserContext);
  return (
    <Tooltip
      placement="top-start"
      content="Username/email can not be changed at this time"
      delay={UIVars.TOOLTIP_DELAY_MS}
    >
      <div className="flex flex-row mb-4">
        <Spacer x={4} />

        <div className="flex flex-col">
          <div className="flex flex-row justify-start items-center space-x-2">
            <FontAwesomeIcon className="text-default-400" icon={faLock} />
            <p className="text-sm text-default-400">{userData.username}</p>
          </div>

          <div className="flex flex-row justify-start items-center space-x-2">
            <FontAwesomeIcon className="text-default-400" icon={faLock} />
            <p className="text-sm text-default-400">{userData.email}</p>
          </div>
        </div>
      </div>
    </Tooltip>
  );
}
