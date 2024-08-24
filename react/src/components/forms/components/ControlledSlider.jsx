import { Slider } from "@nextui-org/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

//Takes a callback expecting a key and value. Executes when user stopps dragging
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
      step={1}
      minValue={0}
      maxValue={numSteps - 1}
      marks={marks}
      defaultValue={defaultValue}
      value={value}
      onChange={setValue}
      onChangeEnd={() => callback(dataKey, value)}
      className="max-w-md sm:ml-5"
    />
  );
}
