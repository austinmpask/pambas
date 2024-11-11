/*-------------------Cleaned up 9/6/24-------------------*/
//Children
import {
  Button,
  Spacer,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
} from "@nextui-org/react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Standardized form submission & optional alt action component. Alt action is only used to confirm deletion of something (project)
export default function SubmitAlt({
  submitLabel,
  altLabel = "",
  altAction = () => {}, //What to run when user confirms the popover for alt button
  confirmThing = "", //Name of thing deleted for confirmation message
  altIcon,
  loading,
  isDisabled,
  vals = [], //React hook form values from parent. Buttons are disabled until all fields passed here have data
}) {
  //Enable button once all fields have some value in them
  const disabled = vals.some((value) => !value);
  return (
    <div className="mt-6 mb-3 w-full flex flex-row items-center sm:w-fit">
      {altLabel && (
        <>
          {/* Alt action acts as a delete button w/confirmation popover. Only used for project deletion */}
          <Popover placement="left">
            <PopoverTrigger>
              <Button
                className="font-semibold"
                size="md"
                radius="sm"
                variant="solid"
                color="danger"
                disabled={loading}
                startContent={
                  altIcon ? (
                    <FontAwesomeIcon className="" icon={altIcon} />
                  ) : null
                }
              >
                {altLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-3 flex flex-column">
              <p className="text-danger font-bold">Confirm project deletion?</p>
              <Divider className="mt-2 mb-2" />
              <p className="font-bold">{confirmThing}</p>
              <Button
                color="danger"
                className="my-2 font-semibold"
                onClick={altAction}
              >
                Confirm
              </Button>
              <p className="italic text-danger-200">This can not be undone</p>
            </PopoverContent>
          </Popover>
          <Spacer x="2" />
        </>
      )}
      <Button
        className="font-semibold sm:mr-1 w-full"
        size="md"
        radius="sm"
        type="submit"
        variant="flat"
        color="primary"
        isLoading={loading}
        isDisabled={loading || disabled || isDisabled}
      >
        {submitLabel}
      </Button>
    </div>
  );
}
