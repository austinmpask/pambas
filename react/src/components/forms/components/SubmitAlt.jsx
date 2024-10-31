/*-------------------Cleaned up 9/6/24-------------------*/
//Children
import { Button } from "@nextui-org/react";

//Standardized form submission & optional alt action component
export default function SubmitAlt({
  submitLabel,
  altLabel = "",
  altAction = () => {},
  loading,
  vals = [], //React hook form values from parent. Buttons are disabled until all fields passed here have data
}) {
  //Enable button once all fields have some value in them
  const disabled = vals.some((value) => !value);
  return (
    <div className="mt-6 mb-3 w-full sm:w-fit">
      <Button
        className="font-semibold sm:mr-1 w-full"
        size="md"
        radius="sm"
        type="submit"
        variant="flat"
        color="primary"
        isLoading={loading}
        isDisabled={loading || disabled}
      >
        {submitLabel}
      </Button>

      {/* Optional alt action button, not present unless explicitly provided for */}
      {altLabel && (
        <Button
          className="font-semibold"
          size="md"
          radius="sm"
          onClick={(e) => {
            e.preventDefault();
            altAction();
          }}
          variant="solid"
          disabled={loading || disabled}
        >
          {altLabel}
        </Button>
      )}
    </div>
  );
}
