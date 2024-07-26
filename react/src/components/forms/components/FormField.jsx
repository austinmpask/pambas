import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Controller } from "react-hook-form";
import Select from "react-select";

//Default text input field to be used across application. Uses react-hook-form
export default function FormField({
  required = true,
  field,
  error,
  label,
  validations,
  loading,
  register = () => {},
  type = "text",
  size = "ff-small",
  placeHolder,
  defaultValue,
  control,
  options,
}) {
  return (
    <div className={`field ${size} mb-1`}>
      <label className="label">{`${label}${required ? "*" : ""}`}</label>
      <div className="control has-icons-right">
        {type === "dropdown" ? (
          <Controller
            name="type"
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => <Select {...field} options={options} />}
          />
        ) : type === "textarea" ? (
          <textarea
            className={`input area-input ${error ? "is-danger" : ""}`}
            type={type}
            {...register(field, validations)}
            disabled={loading}
            placeholder={placeHolder ? placeHolder : ""}
          />
        ) : (
          <input
            className={`input ${error ? "is-danger" : ""}`}
            type={type}
            {...register(field, validations)}
            disabled={loading}
            placeholder={placeHolder ? placeHolder : ""}
          />
        )}

        {error && (
          <span className="icon is-small is-right">
            <FontAwesomeIcon icon={faExclamationTriangle} color="red" />
          </span>
        )}
        <div className="field-error">
          <p className="help is-danger">{error}</p>
        </div>
      </div>
    </div>
  );
}
