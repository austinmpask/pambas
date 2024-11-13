/*-------------------Cleaned up 11/7/24-------------------*/

//React
import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePen, faTrash } from "@fortawesome/free-solid-svg-icons";

//Utils
import toastRequest from "src/utils/toastRequest";

//Contexts
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

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

//Title or header text which opens an edit modal when clicked. Title modal includes option to delete project
export default function ProjectEditableField({
  initialContent,
  objKey,
  onSubmit,
  title = false,
  id,
}) {
  //For redirect upon proj. deletion
  const navigate = useNavigate();

  //Context for updating upon delete
  const { projectSummaryData, setProjectSummaryData } = useContext(
    ProjectSummaryContext
  );

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

  /*Delete the project if user confirms.
  Originally this component was going to have "altaction" used more frequently
  but it only ended up being used for the project deletion.*/
  async function handleDelete(onClose) {
    console.log(id);
    await toastRequest({
      method: "DELETE",
      route: `/project/${id}`,

      //Close modal and redirect to dashboard
      successCB: () => {
        // console.log(projectSummaryData);
        onClose();
        setTimeout(() => {
          navigate("/dashboard");
          setProjectSummaryData((prev) =>
            prev.filter((project) => project.id !== id)
          );
        }, 300);
      },
    });
  }

  //Different modal size for mobile
  const [isMobile, setIsMobile] = useState(false);

  // Set to mobile or not on first render
  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

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
        placement="top"
        size={isMobile ? "full" : "md"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row items-center text-default-700 bg-slate-100">
                {`Edit ${title ? "Project" : DataFields.HEADER_LABEL}`}
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
                <ModalFooter className="flex flex-row items-center">
                  <SubmitAlt
                    vals={formValues}
                    altLabel={title && "Delete"} //Delete only available if editing project title not column headers
                    altIcon={faTrash}
                    submitLabel="Save"
                    confirmThing={initialContent} //Pass title of project in for confirmation popover
                    altAction={() => handleDelete(onClose)} //Deletion will be alt action button
                  />
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
        <div
          className={`relative text-white ${
            title ? "text-xl font-semibold " : "text-xs sm:text-small"
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
        </div>
      </div>
    </>
  );
}
