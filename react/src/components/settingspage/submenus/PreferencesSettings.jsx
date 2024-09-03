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

import ControlledSwitch from "src/components/forms/components/ControlledSwitch";
import ControlledSlider from "src/components/forms/components/ControlledSlider";

//Utils
import toastRequest from "src/utils/toastRequest";
import {
  Validators,
  DataFields,
  UIVars,
  UserSettings,
} from "src/utils/validations";

//Form for changing user info && viewing login credentials
export default function ProfileSettings() {
  //Subscribe to user context
  const { userData, setUserData } = useContext(UserContext);

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm();

  //Whenever user data is updated, reset the form

  //Make request to update user information

  function testCB(dataKey, value) {
    console.log({ dataKey, value });
  }

  return (
    <>
      <ToastContainer />

      <SettingsCard title="General" icon={faGears}>
        <ControlledSwitch
          title="Enable Dark Mode"
          desc="Give your eyes a rest"
          dataKey="darkMode"
          defaultValue={UserSettings.darkMode}
          callback={testCB}
        />
      </SettingsCard>

      <SettingsCard title="Project Page" icon={faTable}>
        <ControlledSwitch
          title="Enable Tooltips"
          desc="Show help dialogues when hovering certain UI components"
          dataKey="tooltips"
          defaultValue={UserSettings.tooltips}
          callback={testCB}
        />

        <ControlledSwitch
          title="Enable Grid Animations"
          desc="Rows jump out when active"
          dataKey="fancyVisuals"
          defaultValue={UserSettings.fancyVisuals}
          callback={testCB}
        />

        <ControlledSwitch
          title="Confirm Before Deleting Open Item"
          desc="Prevent accidental erasure of Open Items"
          dataKey="confirmDelOpenItem"
          defaultValue={UserSettings.confirmDelOpenItem}
          callback={testCB}
        />

        <ControlledSwitch
          title="Only Count Complete Rows as Progress"
          desc="Project progress will not be incremented unless the entire Control Row is complete"
          dataKey="completeProgress"
          defaultValue={UserSettings.completeProgress}
          callback={testCB}
        />
        <Spacer y={4} />
        <Divider />
        <Spacer y={8} />

        <ControlledSlider
          title="Row Hover Delay"
          desc="Adjust the time it takes to select a Control Row after
                mouse-over"
          dataKey="rowHoverDelayPreset"
          defaultValue={UserSettings.rowHoverDelayPreset}
          startIcon={faHourglassHalf}
          endIcon={faBolt}
          numSteps={6}
          callback={testCB}
          marks={[
            {
              value: 5,
              label: "None",
            },
            {
              value: 4,
              label: "Faster",
            },
            {
              value: 3,
              label: "Fast",
            },
            {
              value: 2,
              label: "Default",
            },
            {
              value: 1,
              label: "Slow",
            },
            {
              value: 0,
              label: "Slowest",
            },
          ]}
        />

        <Spacer y={4} />

        <ControlledSlider
          title="Row Height"
          desc="Adjust the height of each Control Row in the Project Grid"
          dataKey="rowHeightPreset"
          defaultValue={UserSettings.rowHeightPreset}
          startIcon={faDownLeftAndUpRightToCenter}
          endIcon={faUpRightAndDownLeftFromCenter}
          numSteps={3}
          callback={testCB}
          marks={[
            {
              value: 0,
              label: "Small",
            },
            {
              value: 1,
              label: "Default",
            },
            {
              value: 2,
              label: "Large",
            },
          ]}
        />

        <Spacer y={4} />

        <ControlledSlider
          title="Expanded Row Height"
          desc="Adjust the height the Control Row when editing Quick Notes"
          dataKey="rowExpandedPreset"
          defaultValue={UserSettings.rowExpandedPreset}
          startIcon={faDownLeftAndUpRightToCenter}
          endIcon={faUpRightAndDownLeftFromCenter}
          numSteps={3}
          callback={testCB}
          marks={[
            {
              value: 0,
              label: "Small",
            },
            {
              value: 1,
              label: "Default",
            },
            {
              value: 2,
              label: "Large",
            },
          ]}
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

        <ControlledSwitch
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
