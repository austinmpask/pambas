/*-------------------Cleaned up 11/7/24-------------------*/

//React
import { useContext, useState, useEffect, useRef } from "react";

//Utils
import toastRequest from "src/utils/toastRequest";
import { Validators, DataFields } from "src/utils/validations";
import pendingItemIcon from "src/utils/pendingItemIcon";

//Icons
import {
  faFile,
  faPen,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Children
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Spacer,
  Divider,
} from "@nextui-org/react";

//Form
import { useForm, useWatch } from "react-hook-form";
import ControlledInput from "src/components/forms/components/ControlledInput";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

//Contexts
import { LineStateContext } from "src/components/projectpage/lineitem/LineItemWrapper";
import { HeaderStatsContext } from "src/pages/ProjectPage";

//Modal form which can be used to ADD or EDIT an open item
export default function ItemModal({
  editing = false,
  isOpen, //For ADD and EDITING
  onOpenChange, //For ADD and EDITING
  itemID, //For EDITING. Could be taken from itemData but leaving as is for clarity
  itemData, //For EDITING
  setItemData, //For EDITING
}) {
  // Consume context and setter for the specific control
  const { lineState, setLineState } = useContext(LineStateContext);

  //Dynamic icon which will change as user types
  const [icon, setIcon] = useState(faFile);

  //Ref for focusing the first controlled input on open
  const inputRef = useRef(null);

  // Use setter for header stats since adding items will not trigger a new fetch of data from DB
  const { setHeaderStats } = useContext(HeaderStatsContext);

  //Form setup
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //Watch values to be passed to child submit button. This will only be used for ADDING an item
  const formValues = useWatch({
    control,
    name: ["itemName"],
  });

  //Update the icon to match based on keywords when the user is typing the name
  useEffect(() => {
    formValues && formValues[0] && setIcon(pendingItemIcon(formValues[0]));
  }, [formValues]);

  //When closing the modal, reset the form. Maybe not best implementation but there was a bug after adding an item where data would persist.
  useEffect(() => {
    !isOpen && !editing && setTimeout(() => reset(), 120);

    //Focus the first field when opening
    isOpen && inputRef.current && inputRef.current.focus();
  }, [isOpen]);

  //Different modal size for mobile
  const [isMobile, setIsMobile] = useState(false);

  // Set to mobile or not on first render
  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //Handle both adding and editing an open item
  async function itemRequest(data, onClose) {
    // ------------- CREATE AN ITEM ---------------------
    if (!editing) {
      await toastRequest({
        method: "POST",
        route: "/openitem",
        data: { ...data, lineID: lineState.id },
        setLoading,
        successCB: () => {
          //Close modal
          onClose();
          //Update the linestate to reflect an additional open item.
          //This will trigger a refresh of the open item list from the db
          setLineState((prev) => ({
            ...prev,
            pendingItems: prev.pendingItems + 1,
          }));

          //Populate the information to the summary stats
          setHeaderStats((prev) => ({
            ...prev,
            openItems: prev.openItems + 1,
          }));
        },
      });
    } else if (editing) {
      // ------------- CREATE AN ITEM ---------------------

      await toastRequest({
        method: "PUT",
        route: `/openitem/${itemID}`,
        data,
        setLoading,
        successCB: (data) => {
          //Close modal
          onClose();
          //Update the open item to reflect the edits returned from db.
          setItemData((prev) => {
            return {
              ...prev,
              controlOwner: data.controlOwner,
              itemName: data.itemName,
              description: data.description,
            };
          });
        },
      });
    }
  }

  return (
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
              <FontAwesomeIcon
                className="mr-2"
                icon={editing ? faPen : faWandMagicSparkles}
              />
              <span>{editing ? "Edit Item" : "Add Item"}</span>
            </ModalHeader>
            <Divider className="mb-4" />
            <form onSubmit={handleSubmit((data) => itemRequest(data, onClose))}>
              <ModalBody>
                <div className="flex flex-row items-center justify-start mb-0 sm:mb-10">
                  <div>
                    <ControlledInput
                      focusRef={inputRef}
                      required
                      field="itemName"
                      errors={errors}
                      label={DataFields.PENDING_ITEM_NAME_LABEL}
                      validations={Validators.PendingItemName}
                      loading={loading}
                      control={control}
                      size="s"
                      type="text"
                      defaultValue={editing ? itemData.itemName : null}
                    />
                    <Spacer y="3" />

                    <ControlledInput
                      field="controlOwner"
                      errors={errors}
                      label={DataFields.CONTROL_OWNER_NAME_LABEL}
                      validations={Validators.ControlOwnerName}
                      loading={loading}
                      control={control}
                      size="s"
                      type="text"
                      defaultValue={editing ? itemData.controlOwner : null}
                    />
                  </div>
                  <div className="w-full flex justify-center text-default-200">
                    <FontAwesomeIcon size="3x" icon={icon} />
                  </div>
                </div>

                <ControlledInput
                  field="description"
                  errors={errors}
                  label="Description"
                  validations={Validators.PendingItemDesc}
                  loading={loading}
                  control={control}
                  size="lg"
                  type="text"
                  defaultValue={editing ? itemData.description : null}
                />
              </ModalBody>
              <ModalFooter>
                <SubmitAlt
                  vals={editing ? [] : formValues}
                  submitLabel={editing ? "Save" : "Add"}
                  loading={loading}
                />
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
