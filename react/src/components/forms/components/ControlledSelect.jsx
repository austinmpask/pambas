/*-------------------Cleaned up 10/29/24-------------------*/

//Children
import { Select, SelectItem } from "@nextui-org/react";

//Forms
import { Controller } from "react-hook-form";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";

//Controlled dropdown selection. Must have default selection
export default function ControlledSelect({
  required = false,
  label,
  field,
  loading,
  control,
  items,
  defaultSelection,
  color = false, //For when this is used to select theme, show the theme thumbnail color on the option
}) {
  return (
    <Controller
      name={field} //Take field from parent form
      control={control} //Take control from parent form
      defaultValue={new Set(String(defaultSelection.value))}
      render={({ field: { onChange, value } }) => (
        <Select
          className="w-[200px]"
          label={<span className="text-medium font-semibold">{label}</span>}
          labelPlacement="outside"
          isRequired={required}
          isDisabled={loading}
          selectedKeys={value}
          onSelectionChange={onChange}
          startContent={
            color ? (
              <FontAwesomeIcon
                className={items[value.values().next().value].thumb}
                icon={faSquare}
              /> //thumb = thumbnail color for themes
            ) : null
          }
        >
          {items.map((item) => (
            <SelectItem
              startContent={
                color ? (
                  <FontAwesomeIcon className={item.thumb} icon={faSquare} /> //thumb = thumbnail color for themes
                ) : null
              }
              key={item.value}
            >
              {item.label}
            </SelectItem>
          ))}
        </Select>
      )}
    />
  );
}
