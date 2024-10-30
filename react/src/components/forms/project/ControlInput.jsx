/*-------------------Cleaned up 10/29/24-------------------*/

//Children
import { Input } from "@nextui-org/react";

//Input for amount of controls for a given section when creating new project. Saves to parent form array of section data
export default function ControlInput({ loading, index, forward, value }) {
  return (
    <Input
      label="# of Controls"
      type="number"
      value={value || ""}
      isDisabled={loading}
      onValueChange={(data) => forward(Number(data), index, true)} //Forward the data to the parent on change
    />
  );
}
