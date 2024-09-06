/*-------------------Cleaned up 9/6/24-------------------*/
//Children
import { Switch, cn } from "@nextui-org/react";

//Form
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";

//Use react hook form controller on a switch component. Takes a callback which expects key and value
//Does not require a parent form like text input, this is self contained due to lack of user confirmation needed after making a change.
export default function ControlledSwitch({
  title,
  desc,
  dataKey,
  defaultValue = false,
  callback = () => {},
}) {
  //Create form control
  const { control } = useForm();

  return (
    <Controller
      control={control}
      name="Switch"
      render={({ field: { onChange, value } }) => (
        <Switch
          value={value}
          defaultSelected={defaultValue}
          onValueChange={(value) => {
            onChange(value);
            callback(dataKey, value);
          }}
          // A default styling option from NextUI documentation for a fancier looking switch
          classNames={{
            base: cn(
              "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
              "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent"
            ),
            wrapper: "p-0 h-4 overflow-visible",
            thumb: cn(
              "w-6 h-6 border-2 shadow-lg",
              "group-data-[hover=true]:border-primary",
              //selected
              "group-data-[selected=true]:ml-6",
              // pressed
              "group-data-[pressed=true]:w-7",
              "group-data-[selected]:group-data-[pressed]:ml-4"
            ),
          }}
        >
          {/* Switch label and description */}
          <div className="flex flex-col gap-1">
            <p className="text-medium">{title}</p>
            <p className="text-tiny text-default-400">{desc}</p>
          </div>
        </Switch>
      )}
    />
  );
}
