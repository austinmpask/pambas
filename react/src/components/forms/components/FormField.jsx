import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Default text input field to be used across application. Uses react-hook-form
export default function FormField({
  field,
  error,
  label,
  validations,
  loading,
  register,
  type = "text",
  size = "ff-small",
}) {
  return (
    <div className={`field ${size} mb-1`}>
      <label className="label">{label}</label>
      <div className="control has-icons-right">
        <input
          className={`input ${error ? "is-danger" : ""}`}
          type={type}
          {...register(field, validations)}
          disabled={loading}
        />
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
