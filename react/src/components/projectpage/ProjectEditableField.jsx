/*-------------------Cleaned up 11/7/24-------------------*/

//React
import { useState, useRef, useEffect } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePen } from "@fortawesome/free-solid-svg-icons";

//Children
import ControlledInput from "src/components/forms/components/ControlledInput";
import SubmitAlt from "src/components/forms/components/SubmitAlt";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Divider,
  useDisclosure,
} from "@nextui-org/react";

//Utils
import { Validators, DataFields } from "src/utils/validations";

//Form
import { useForm, useWatch } from "react-hook-form";

//Title or header text which opens an edit modal when clicked
export default function ProjectEditableField({
  initialContent,
  objKey,
  onSubmit,
  title = false,
}) {
  //Track if mouse is over component for edit icon
  const [hovering, setHovering] = useState(false);

  //Ref for focusing the input when modal opens
  const inputRef = useRef(null);

  //Modal builtins
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  //Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  //Watch value change for submit button disabled/enabled
  const formValues = useWatch({
    control,
    name: ["input"],
  });

  useEffect(() => {
    //When closing the modal, reset the form. Maybe not best implementation but there was a bug
    !isOpen && setTimeout(() => reset(), 120);

    //Focus the first field when opening
    isOpen && inputRef.current && inputRef.current.focus();
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        shouldBlockScroll={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row items-center text-default-700 bg-slate-100">
                {title
                  ? `New ${DataFields.PROJECT_TITLE_LABEL}`
                  : `Edit ${DataFields.HEADER_LABEL}`}
              </ModalHeader>
              <Divider className="mb-4" />
              <form
                onSubmit={handleSubmit((data) => {
                  onClose();
                  onSubmit(objKey, data.input);
                })}
              >
                <ModalBody>
                  <ControlledInput
                    focusRef={inputRef}
                    required
                    field="input"
                    errors={errors}
                    label={
                      title
                        ? DataFields.PROJECT_TITLE_LABEL
                        : DataFields.HEADER_LABEL
                    }
                    validations={
                      title ? Validators.ProjectName : Validators.HeaderName
                    }
                    control={control}
                    size="lg"
                    type="text"
                  />
                </ModalBody>
                <ModalFooter>
                  <SubmitAlt vals={formValues} submitLabel={"Save"} />
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>

      <div
        className="flex flex-row items-center justify-center cursor-pointer"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={onOpen}
      >
        {/* Actual text */}
        <p
          className={`relative text-white ${
            title ? "text-xl font-semibold " : "text-small"
          }`}
        >
          {initialContent}
          {hovering && (
            <div
              className={`${
                title ? "-right-6" : "-right-5"
              } absolute top-0 text-white h-full`}
            >
              <FontAwesomeIcon className="" icon={faSquarePen} />
            </div>
          )}
        </p>
      </div>
    </>
  );
}
