/*-------------------Cleaned up 11/10/24-------------------*/

//Icons
import {
  faTable,
  faWandMagicSparkles,
  faDownLeftAndUpRightToCenter,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";

//Form
import { useForm, useWatch } from "react-hook-form";

//Children
import { Divider, Spacer } from "@nextui-org/react";
import SettingsCard from "src/components/settingspage/SettingsCard";
import ControlledSwitch from "src/components/forms/components/ControlledSwitch";
import ControlledSlider from "src/components/forms/components/ControlledSlider";
import ControlledSelect from "src/components/forms/components/ControlledSelect";
import ControlledInput from "src/components/forms/components/ControlledInput";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

//Utils
import { DataFields, UserSettings, Validators } from "src/utils/validations";
import toTitle from "src/utils/toTitle";

//Form for changing user info && viewing login credentials
export default function PreferencesSettings({ request, loading }) {
  //Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //Watch required values and pass to submit button
  const formValues = useWatch({
    control,
    name: ["defaultManagerName"],
  });

  return (
    <>
      <SettingsCard title="Project Page" icon={faTable}>
        <ControlledSwitch
          title="Enable Tooltips"
          desc="Show help dialogues when hovering certain UI components"
          dataKey="tooltips"
          defaultValue={UserSettings.tooltips}
          callback={request}
        />

        <ControlledSwitch
          title="Confirm Before Deleting Open Item"
          desc="Prevent accidental erasure of Open Items"
          dataKey="confirmDelOpenItem"
          defaultValue={UserSettings.confirmDelOpenItem}
          callback={request}
        />

        <ControlledSwitch
          title="Only Count Complete Rows as Progress"
          desc="Project progress will not be incremented unless the entire Control Row is complete"
          dataKey="completeProgress"
          defaultValue={UserSettings.completeProgress}
          callback={request}
        />
        <Spacer y={4} />
        <Divider />
        <Spacer y={8} />

        <ControlledSlider
          title="Row Height"
          desc="Adjust the height of each Control Row in the Project Grid"
          dataKey="rowHeightPreset"
          defaultValue={UserSettings.rowHeightPreset}
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
          dataKey="rowExpandedPreset"
          defaultValue={UserSettings.rowExpandedPreset}
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
            field="defaultProjectType"
            control={control}
            items={DataFields.PROJECT_TYPES}
            defaultSelection={DataFields.DEFAULT_PROJ_TYPE}
            callback={request}
          />

          <Spacer y={8} />

          <ControlledSelect
            label="Default Project Theme"
            field="defaultProjectTheme"
            control={control}
            items={DataFields.PROJECT_THEME_TYPES}
            defaultSelection={DataFields.DEFAULT_PROJECT_THEME}
            color
            callback={request}
          />
        </div>

        <Spacer y={4} />
        <Divider />
        <Spacer y={4} />

        <ControlledSwitch
          title="Autofill Project Manager"
          desc="Automatically assign a default Project Manager to new projects. You can still change before creating the project"
          dataKey="useDefaultManager"
          defaultValue={UserSettings.useDefaultManager}
          callback={request}
        />
        <Spacer y={2} />
        <form
          onSubmit={handleSubmit((data) =>
            request("defaultManagerName", data.defaultManagerName)
          )}
        >
          <div className="flex flex-row items-center flex-wrap md:flex-nowrap gap-4 ml-4">
            <ControlledInput
              required
              field="defaultManagerName"
              errors={errors}
              label={DataFields.FULL_NAME_LABEL}
              placeholder={toTitle(UserSettings.defaultManagerName)}
              validations={Validators.Manager}
              loading={!UserSettings.useDefaultManager || loading}
              control={control}
              size="s"
            />
            <SubmitAlt
              vals={formValues}
              isDisabled={!UserSettings.useDefaultManager}
              loading={loading}
              submitLabel="Save"
            />
          </div>
        </form>
      </SettingsCard>
    </>
  );
}
