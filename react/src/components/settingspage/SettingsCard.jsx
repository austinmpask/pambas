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

//Contexts
import { UserContext } from "src/context/UserContext";

//Toasts
import { ToastContainer } from "react-toastify";

//Form
import { useForm } from "react-hook-form";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

//Utils
import toastRequest from "../../utils/toastRequest";
import { Validators, DataFields, UIVars } from "../../utils/validations";

export default function SettingsCard({ title, icon, children, end = false }) {
  return (
    <>
      <Card className="w-full sm:max-w-[600px] rounded-none sm:rounded-xl">
        <CardHeader className="p-4 sm:pr-6 flex flex-row justify-between">
          <p className="text-xl sm:font-semibold">{title}</p>
          <FontAwesomeIcon size="lg" className="text-default-400" icon={icon} />
        </CardHeader>
        <Divider />

        <CardBody className="p-8 sm:p-6">{children}</CardBody>
      </Card>

      {!end && <Spacer y={4} />}
    </>
  );
}
