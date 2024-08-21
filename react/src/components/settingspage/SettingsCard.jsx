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
import FormField from "src/components/forms/components/FormField";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

//Utils
import toastRequest from "../../utils/toastRequest";
import { Validators, DataFields, UIVars } from "../../utils/validations";

export default function SettingsCard({ title, icon, children, end = false }) {
  return (
    <>
      <Card>
        <div className="flex flex-row">
          <div className="flex flex-col">
            <Card className="w-[600px]">
              <CardHeader className="p-4 pr-6 flex flex-row justify-between">
                <p className="text-xl font-semibold">{title}</p>
                <FontAwesomeIcon
                  size="lg"
                  className="text-default-400"
                  icon={icon}
                />
              </CardHeader>
              <Divider />

              <CardBody className="p-6">{children}</CardBody>
            </Card>
          </div>
        </div>
      </Card>
      {!end && <Spacer y={4} />}
    </>
  );
}
