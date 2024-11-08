/*-------------------Cleaned up 9/6/24-------------------*/
//React
import { useState } from "react";

//Children
import { Input } from "@nextui-org/react";

//Forms
import { Controller } from "react-hook-form";

//Utils
import { UIVars } from "src/utils/validations";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

//Render a styled input field which dynamically shows validation errors. Requires react hook form in parent, takes control as prop.
export default function ControlledInput({
  required = false,
  focusRef,
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
  startIcon = null,
}) {
  //State for showing/hiding password text when applicable
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      name={field} //Take field from parent form
      control={control} //Take control from parent form
      rules={validations}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
        <Input
          isRequired={required}
          isInvalid={!!errors[field]}
          errorMessage={errors[field]?.message}
          className={`w-full ${UIVars.INPUT_SIZE_PRESET_PX[size]}`}
          label={label}
          ref={focusRef}
          onValueChange={onChange}
          value={value ?? ""}
          variant={errors[field] ? "bordered" : ""}
          isDisabled={loading}
          placeholder={placeholder}
          startContent={startIcon ? <FontAwesomeIcon icon={startIcon} /> : null}
          // Password specific additions
          endContent={
            type === "password" && value ? (
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => setVisible((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {/* Show an eye open/shut icon when password text is visible or not */}
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
          type={
            //This is the only way this would work i swear lol
            type === "password"
              ? visible
                ? "text"
                : "password"
              : type === "text"
              ? "text"
              : "number"
          }
        />
      )}
    />
  );
}
