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
}) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control has-icons-right">
        <input
          className={`input ${error ? "is-danger" : ""}`}
          type="text"
          {...register(field, validations)}
          disabled={loading}
        />
        {error && (
          <span className="icon is-small is-right">
            <FontAwesomeIcon icon={faExclamationTriangle} color="red" />
          </span>
        )}
        <div>
          <p className="help is-danger field-error">{error}</p>
        </div>
      </div>
    </div>
  );
}
