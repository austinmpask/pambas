import { Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";

import { useState } from "react";

import { Validators, DataFields, UIVars } from "src/utils/validations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
//Render a controlled field, requiring form submission, which will expect a react hook form control from the parent.
export default function ControlledInput({
  required = false,
  type = "text",
  field,
  label,
  errors,
  validations,
  loading,
  size = "m",
  placeholder = "",
  defaultValue,
  control,
  isClearable = false,
  startIcon = null,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      name={field}
      control={control}
      rules={validations}
      render={({ field: { onChange, value } }) => (
        <Input
          isRequired={required}
          isInvalid={!!errors[field]}
          errorMessage={errors[field]?.message}
          className={`w-full ${UIVars.INPUT_SIZE_PRESET_PX[size]}`}
          label={label}
          onValueChange={onChange}
          value={value ?? ""}
          variant={!!errors[field] ? "bordered" : ""}
          isDisabled={loading}
          placeholder={placeholder}
          startContent={startIcon ? <FontAwesomeIcon icon={startIcon} /> : null}
          // Password specific
          endContent={
            type === "password" && value ? (
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => setVisible((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {visible ? (
                  <div className="text-s text-default-400 pointer-events-none">
                    <FontAwesomeIcon icon={faEye} />
                  </div>
                ) : (
                  <div className="text-s text-default-400 pointer-events-none">
                    <FontAwesomeIcon icon={faEyeSlash} />
                  </div>
                )}
              </button>
            ) : null
          }
          type={type === "password" && !visible ? "password" : "text"}
        />
      )}
    />
  );
}
