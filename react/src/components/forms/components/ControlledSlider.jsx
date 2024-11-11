/*-------------------Cleaned up 9/6/24-------------------*/
//React
import { useState } from "react";

//Children
import { Slider } from "@nextui-org/react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Slider which takes a callback which will run when the user stops dragging the slider. Expects key value pair to mutate
//I have abstracted the detail offered by Slider component. This slider will always have integer "values" of 0-n.
export default function ControlledSlider({
  title,
  desc,
  dataKey,
  callback = () => {},
  defaultValue,
  startIcon,
  endIcon,
  numSteps,
  marks,
}) {
  //State to track current value of slider
  const [value, setValue] = useState(defaultValue);

  return (
    <Slider
      hideValue
      label={
        <>
          <p className="text-medium">{title}</p>
          <p className=" mb-2 text-tiny text-default-400">{desc}</p>
        </>
      }
      // Add icon to beginning and end of slider
      startContent={
        startIcon && (
          <FontAwesomeIcon className="text-default-400" icon={startIcon} />
        )
      }
      endContent={
        endIcon && (
          <FontAwesomeIcon className="text-default-400" icon={endIcon} />
        )
      }
      step={1} // Slider is always steps of 1, with integer values 0-n. Too annoying otherwise.
      minValue={0}
      maxValue={numSteps - 1}
      marks={marks}
      defaultValue={defaultValue}
      value={value}
      onChange={setValue}
      onChangeEnd={(v) => {
        callback(dataKey, v);
      }} //Execute the callback function when user is done dragging
      className="max-w-md sm:ml-5"
    />
  );
}
