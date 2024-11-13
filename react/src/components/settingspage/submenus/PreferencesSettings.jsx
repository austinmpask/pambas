/*-------------------Cleaned up 11/10/24-------------------*/
import { useContext } from "react";

//Icons
import {
  faTable,
  faWandMagicSparkles,
  faDownLeftAndUpRightToCenter,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";

//Form
import { useForm } from "react-hook-form";

//Children
import { Divider, Spacer } from "@nextui-org/react";
import SettingsCard from "src/components/settingspage/SettingsCard";
import ControlledSwitch from "src/components/forms/components/ControlledSwitch";
import ControlledSlider from "src/components/forms/components/ControlledSlider";
import ControlledSelect from "src/components/forms/components/ControlledSelect";

import { UserContext } from "src/context/UserContext";

//Utils
import { DataFields } from "src/utils/validations";

//Form for changing user info && viewing login credentials
export default function PreferencesSettings({ request }) {
  const { userData } = useContext(UserContext);
  //Form setup
  const { control } = useForm();

  return (
    <>
      <SettingsCard title="Project Page" icon={faTable}>
        <ControlledSwitch
          title="Enable Tooltips"
          desc="Show help dialogues when hovering certain UI components"
          dataKey="tooltips"
          defaultValue={userData.tooltips}
          callback={request}
        />

        <ControlledSwitch
          title="Only Count Complete Rows as Progress"
          desc="Project progress will not be incremented unless the entire Control Row is complete"
          dataKey="complete_progress"
          defaultValue={userData.complete_progress}
          callback={request}
        />
        <Spacer y={4} />
        <Divider />
        <Spacer y={8} />

        <ControlledSlider
          title="Row Height"
          desc="Adjust the height of each Control Row in the Project Grid"
          dataKey="row_height_preset"
          defaultValue={userData.row_height_preset}
          startIcon={faDownLeftAndUpRightToCenter}
          endIcon={faUpRightAndDownLeftFromCenter}
          numSteps={3}
          callback={request}
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
          dataKey="row_expanded_preset"
          defaultValue={userData.row_expanded_preset}
          startIcon={faDownLeftAndUpRightToCenter}
          endIcon={faUpRightAndDownLeftFromCenter}
          numSteps={3}
          callback={request}
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
        <div className="mx-5 mt-4">
          <ControlledSelect
            label="Default Project Type"
            field="default_project_type"
            control={control}
            items={DataFields.PROJECT_TYPES}
            defaultSelection={DataFields.PROJECT_TYPES.find(
              (type) => type.value === userData.default_project_type
            )}
            callback={request}
          />

          <Spacer y={8} />

          <ControlledSelect
            label="Default Project Theme"
            field="default_project_theme"
            control={control}
            items={DataFields.PROJECT_THEME_TYPES}
            defaultSelection={DataFields.PROJECT_THEME_TYPES.find(
              (type) => type.value === userData.default_project_theme
            )}
            color
            callback={request}
          />
        </div>

        <Spacer y={4} />
      </SettingsCard>
    </>
  );
}
