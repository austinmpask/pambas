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
  Switch,
  cn,
  Slider,
  Select,
  SelectItem,
  Input,
  Button,
} from "@nextui-org/react";
//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGear,
  faUniversalAccess,
  faCode,
  faTable,
  faGaugeHigh,
  faWandMagicSparkles,
  faBolt,
  faHourglassHalf,
  faGears,
  faDownLeftAndUpRightToCenter,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";

//Contexts
import { UserContext } from "src/context/UserContext";

//Toasts
import { ToastContainer } from "react-toastify";

//Form
import { useForm } from "react-hook-form";
import FormField from "src/components/forms/components/FormField";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

import SettingsCard from "src/components/settingspage/SettingsCard";
import SettingsCardSection from "src/components/settingspage/SettingsCardSection";

import FancySwitch from "src/components/settingspage/FancySwitch";

//Utils
import toastRequest from "src/utils/toastRequest";
import { Validators, DataFields, UIVars } from "src/utils/validations";

//Form for changing user info && viewing login credentials
export default function ProfileSettings() {
  //Subscribe to user context
  const { userData, setUserData } = useContext(UserContext);

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm();

  //Whenever user data is updated, reset the form

  //Make request to update user information

  return (
    <>
      <ToastContainer />

      <SettingsCard title="General" icon={faGears}>
        <FancySwitch title="Enable Dark Mode" desc="Give your eyes a rest" />
      </SettingsCard>

      <SettingsCard title="Project Page" icon={faTable}>
        <FancySwitch
          title="Enable Tooltips"
          desc="Show help dialogues when hovering certain UI components"
        />

        <FancySwitch
          title="Enable Grid Animations"
          desc="Rows jump out when active"
        />

        <FancySwitch
          title="Confirm Before Deleting Open Item"
          desc="Prevent accidental erasure of Open Items"
        />

        <FancySwitch
          title="Only Count Complete Rows as Progress"
          desc="Project progress will not be incremented unless the entire Control Row is complete"
        />
        <Spacer y={4} />
        <Divider />
        <Spacer y={8} />
        <Slider
          label={
            <>
              <p className="text-medium">Row Hover Delay</p>
              <p className=" mb-2 text-tiny text-default-400">
                Adjust the time it takes to select a Control Row after
                mouse-over
              </p>
            </>
          }
          hideValue
          startContent={
            <FontAwesomeIcon
              className="text-default-400"
              icon={faHourglassHalf}
            />
          }
          endContent={
            <FontAwesomeIcon className="text-default-400" icon={faBolt} />
          }
          step={1}
          maxValue={6}
          minValue={1}
          marks={[
            {
              value: 6,
              label: "None",
            },
            {
              value: 5,
              label: "Faster",
            },
            {
              value: 4,
              label: "Fast",
            },
            {
              value: 3,
              label: "Default",
            },
            {
              value: 2,
              label: "Slow",
            },
            {
              value: 1,
              label: "Slowest",
            },
          ]}
          defaultValue={3}
          className="max-w-md ml-5"
        />
        <Spacer y={4} />
        <Slider
          label={
            <>
              <p className="text-medium">Row Height</p>
              <p className=" mb-2 text-tiny text-default-400">
                Adjust the height of each Control Row in the Project Grid
              </p>
            </>
          }
          hideValue
          startContent={
            <FontAwesomeIcon
              className="text-default-400"
              icon={faDownLeftAndUpRightToCenter}
            />
          }
          endContent={
            <FontAwesomeIcon
              className="text-default-400"
              icon={faUpRightAndDownLeftFromCenter}
            />
          }
          step={1}
          maxValue={3}
          minValue={1}
          marks={[
            {
              value: 1,
              label: "Small",
            },
            {
              value: 2,
              label: "Default",
            },
            {
              value: 3,
              label: "Large",
            },
          ]}
          defaultValue={2}
          className="max-w-md ml-5"
        />
        <Spacer y={4} />
        <Slider
          label={
            <>
              <p className="text-medium">Expanded Row Height</p>
              <p className=" mb-2 text-tiny text-default-400">
                Adjust the height the Control Row when editing Quick Notes
              </p>
            </>
          }
          hideValue
          startContent={
            <FontAwesomeIcon
              className="text-default-400"
              icon={faDownLeftAndUpRightToCenter}
            />
          }
          endContent={
            <FontAwesomeIcon
              className="text-default-400"
              icon={faUpRightAndDownLeftFromCenter}
            />
          }
          step={1}
          maxValue={3}
          minValue={1}
          marks={[
            {
              value: 1,
              label: "Small",
            },
            {
              value: 2,
              label: "Default",
            },
            {
              value: 3,
              label: "Large",
            },
          ]}
          defaultValue={2}
          className="max-w-md ml-5"
        />
      </SettingsCard>

      <SettingsCard title="New Projects" icon={faWandMagicSparkles}>
        <Select
          labelPlacement="outside-left"
          label={
            <>
              <p className="text-medium">Default Project Type</p>
              <p className=" mb-2 text-tiny text-default-400">
                You can still select any type when creating a project
              </p>
            </>
          }
          className="max-w-xs ml-5 mb-2"
        >
          {DataFields.PROJECT_TYPES.map((project) => (
            <SelectItem key={project.label}>{project.label}</SelectItem>
          ))}
        </Select>
        <Spacer y={4} />
        <Select
          labelPlacement="outside-left"
          label={
            <>
              <p className="text-medium">Default Project Color</p>
              <p className=" mb-2 text-tiny text-default-400">
                You can still select any color when creating a project
              </p>
            </>
          }
          className="max-w-xs ml-5 mb-2"
        >
          {DataFields.PROJECT_TYPES.map((project) => (
            <SelectItem key={project.label}>{project.label}</SelectItem>
          ))}
        </Select>

        <Spacer y={4} />
        <Divider />
        <Spacer y={4} />

        <FancySwitch
          title="Autofill Project Manager"
          desc="Automatically assign a default Project Manager to new projects. You can still change before creating the project"
        />
        <Spacer y={2} />
        <div className="flex flex-row items-center flex-wrap md:flex-nowrap gap-4 ml-4">
          <Input className="w-1/3" type="text" label="Manager Name" />
          <Button
            color="primary"
            className="font-semibold"
            size="md"
            radius="sm"
          >
            Save
          </Button>
        </div>
      </SettingsCard>
      <SettingsCard title="Dashboard" icon={faGaugeHigh}></SettingsCard>
    </>
  );
}
