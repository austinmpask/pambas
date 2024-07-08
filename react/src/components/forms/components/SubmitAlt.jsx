//Default submit and cancel/alt action form component
export default function SubmitAlt({
  submitLabel,
  altLabel,
  altAction,
  isLink,
  loading,
}) {
  return (
    <div className="field is-grouped">
      <div className="control">
        <button
          type="submit"
          className={`button is-link ${loading && " is-loading"}`}
          disabled={loading}
        >
          {submitLabel}
        </button>
      </div>
      <div className="control">
        <button
          onClick={(e) => {
            e.preventDefault();
            altAction();
          }}
          className="button is-light"
          disabled={loading}
        >
          {altLabel}
        </button>
      </div>
    </div>
  );
}
