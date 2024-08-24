import { Button } from "@nextui-org/react";

//Default submit and cancel/alt action form component
export default function SubmitAlt({
  submitLabel,
  altLabel = "",
  altAction = () => {},
  isLink,
  loading,
  vals = [],
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
        variant="solid"
        color="primary"
        isLoading={loading}
        isDisabled={loading || disabled}
      >
        {submitLabel}
      </Button>

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
