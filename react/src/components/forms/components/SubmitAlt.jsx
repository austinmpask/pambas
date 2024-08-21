import { Button } from "@nextui-org/react";

//Default submit and cancel/alt action form component
export default function SubmitAlt({
  submitLabel,
  altLabel,
  altAction,
  isLink,
  loading,
}) {
  return (
    <div className="mt-6 mb-3">
      <Button
        className="font-semibold mr-1"
        size="md"
        radius="sm"
        type="submit"
        variant="solid"
        color="primary"
        isLoading={loading}
        disabled={loading}
      >
        {submitLabel}
      </Button>
      <Button
        className="font-semibold"
        size="md"
        radius="sm"
        onClick={(e) => {
          e.preventDefault();
          altAction();
        }}
        variant="solid"
        disabled={loading}
      >
        {altLabel}
      </Button>
    </div>
  );
}
