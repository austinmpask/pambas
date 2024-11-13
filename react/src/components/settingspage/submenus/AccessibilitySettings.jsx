/*-------------------Cleaned up 11/10/24-------------------*/

//React
import { useContext } from "react";

//Icons
import {
  faUniversalAccess,
  faBolt,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";

//Children
import { Divider, Spacer } from "@nextui-org/react";
import SettingsCard from "src/components/settingspage/SettingsCard";
import ControlledSwitch from "src/components/forms/components/ControlledSwitch";
import ControlledSlider from "src/components/forms/components/ControlledSlider";

//Context
import { UserContext } from "src/context/UserContext";

// Options for accessibility settings
export default function AccessibilitySettings({ request }) {
  const { userData } = useContext(UserContext);

  return (
    <SettingsCard title="Accessibility" icon={faUniversalAccess}>
      <ControlledSwitch
        title="Use High Contrast Themes"
        desc="Increase visibility by increasing contrast between colored UI components"
        dataKey="high_contrast"
        defaultValue={userData.high_contrast}
        callback={request}
      />
      <Spacer y={4} />
      <Divider />
      <Spacer y={8} />

      <ControlledSlider
        title="Tooltip Activation Delay"
        desc="Adjust the time it takes for a tooltip popup to appear after hovering a UI component"
        dataKey="tooltip_delay"
        defaultValue={userData.tooltip_delay}
        startIcon={faHourglassHalf}
        endIcon={faBolt}
        numSteps={5}
        callback={request}
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
  );
}
