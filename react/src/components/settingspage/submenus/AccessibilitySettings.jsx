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

export default function AccessibilitySettings() {
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

      <SettingsCard title="Accessibility" icon={faUniversalAccess}>
        <ControlledSwitch
          title="Use High Contrast Themes"
          desc="Increase visibility by increasing contrast between colored UI components"
          dataKey="highContrast"
          defaultValue={UserSettings.highContrast}
          callback={testCB}
        />
        <Spacer y={4} />
        <Divider />
        <Spacer y={8} />

        <ControlledSlider
          title="Tooltip Activation Delay"
          desc="Adjust the time it takes for a tooltip popup to appear after hovering a UI component"
          dataKey="tooltipHoverDelayPreset"
          startIcon={faHourglassHalf}
          endIcon={faBolt}
          numSteps={5}
          callback={testCB}
          defaultValue={UserSettings.tooltipHoverDelayPreset}
          marks={[
            {
              value: 4,
              label: "None",
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
      </SettingsCard>
    </>
  );
}
