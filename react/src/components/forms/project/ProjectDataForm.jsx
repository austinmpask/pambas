/*-------------------Cleaned up 10/29/24-------------------*/

//React
import { useContext } from "react";

//Contexts
import { UserContext } from "src/context/UserContext";

//Children
import ControlledInput from "src/components/forms/components/ControlledInput";
import ControlledSelect from "src/components/forms/components/ControlledSelect";
import SubmitAlt from "src/components/forms/components/SubmitAlt";
import { Card, CardHeader, CardBody, Divider, Spacer } from "@nextui-org/react";

//Utils
import { Validators, DataFields } from "src/utils/validations";
import toTitle from "src/utils/toTitle";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

//Form
import { useForm, useWatch } from "react-hook-form";

// Part of the new project form which gathers high level details, not sections/controls etc.
export default function ProjectDataForm({ submit, loading }) {
  const { userData } = useContext(UserContext);
  //Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //Watch required values and pass to submit button
  const formValues = useWatch({
    control,
    name: ["name", "manager", "type", "theme", "budget"],
  });

  return (
    <Card className="w-full mb-4 sm:w-5/6 lg:w-2/5 h-fit transition-all rounded-none sm:rounded-xl">
      <CardHeader className="h-[60px] p-4 flex flex-row justify-between">
        <p className="font-semibold">
          {formValues[0] ? toTitle(formValues[0]) : "New Project Details"}
        </p>
        <FontAwesomeIcon
          className="text-default-300"
          icon={faWandMagicSparkles}
        />
      </CardHeader>
      <Divider />
      <CardBody className="p-8">
        {/* Project form */}
        <form onSubmit={handleSubmit((data) => submit(data))}>
          <p className="text-l font-semibold">Project Title & Manager</p>
          <Spacer y={4} />
          <div className="flex flex-row">
            <ControlledInput
              required
              field="name"
              errors={errors}
              label={DataFields.PROJECT_TITLE_LABEL}
              validations={Validators.ProjectName}
              loading={loading}
              control={control}
              size="s"
            />

            <Spacer x={4} />
            <ControlledInput
              required
              field="manager"
              errors={errors}
              label="Project Manager"
              validations={Validators.Manager}
              loading={loading}
              control={control}
              size="s"
            />
          </div>
          <Spacer y={12} />

          <ControlledSelect
            label="Type"
            field="type"
            loading={loading}
            control={control}
            items={DataFields.PROJECT_TYPES}
            defaultSelection={DataFields.PROJECT_TYPES.find(
              (type) => type.value === userData.default_project_type
            )}
            required
          />
          <Spacer y={8} />
          <ControlledSelect
            label="Theme"
            field="theme"
            loading={loading}
            control={control}
            items={DataFields.PROJECT_THEME_TYPES}
            defaultSelection={DataFields.PROJECT_THEME_TYPES.find(
              (type) => type.value === userData.default_project_theme
            )}
            color
            required
          />

          <Spacer y={8} />
          <Divider />
          <Spacer y={8} />
          <p className="text-medium font-semibold">
            How many hours are you assigned?
          </p>
          <p className="mt-2 text-xs w-1/2 text-default-500 italic">
            Pambas lets you quickly log your hours and helps track your budget
            to actual. Cool!
          </p>

          <Spacer y={4} />
          <ControlledInput
            required
            field="budget"
            errors={errors}
            label={DataFields.BUDGET_LABEL}
            validations={Validators.Budget}
            loading={loading}
            control={control}
            type="number"
            size="xs"
          />
          <Spacer y={4} />

          {/* Submit */}
          <div className="w-full mt-6 sm:mt-0 sm:w-fit">
            <SubmitAlt
              vals={formValues}
              submitLabel="Create"
              loading={loading}
            />
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
