//React
import { useState } from "react";
import { createPortal } from "react-dom";

//Utils
import toastRequest from "src/utils/toastRequest";
import { DataFields, Validators } from "src/utils/validations";

//Form
import { useForm } from "react-hook-form";
import FormField from "src/components/forms/components/FormField";
import SubmitAlt from "src/components/forms/components/SubmitAlt";
import { CSSTransition } from "react-transition-group";

//Modal form which can be used to add a new pending item or edit an existing one
export default function ItemModal({
  lineID,
  open,
  setOpen,
  setLineState,
  editing = false,
  itemID,
  itemData,
  setItemData,
  setHeaderStats,
}) {
  //Form setup
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  //Loading state for visuals
  const [loading, setLoading] = useState(false);

  //Handle both adding and editing an open item
  async function itemRequest(data) {
    //For creating a new item:
    if (!editing) {
      await toastRequest({
        method: "POST",
        route: "/openitem",
        data: { ...data, lineID },
        setLoading,
        successCB: () => {
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
        sToastDisabled: true,
      });
      closeModal();
    } else if (editing) {
      //For editing an open item:

      //Default to previous values if user did not submit anything
      Object.keys(data).forEach((field) => {
        data[field] = data[field] || itemData[field];
      });

      await toastRequest({
        method: "PUT",
        route: `/openitem/${itemID}`,
        data,
        setLoading,
        successCB: (data) => {
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
      closeModal();
    }
  }

  //Remove modal and reset form
  function closeModal() {
    setOpen(false);
    setLoading(false);
    reset();
    clearErrors();
  }

  //Modal to appear ontop of entire DOM
  return createPortal(
    <>
      <div className={`modal${open ? " is-active" : ""}`}>
        <div className="modal-background"></div>
        <CSSTransition
          in={open}
          unmountOnExit
          timeout={110}
          classNames={"modal"}
        >
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">{`${
                editing ? "Edit " : "Add "
              }Pending Item`}</p>
              <button
                className="delete"
                aria-label="close"
                disabled={loading}
                onClick={closeModal}
              ></button>
            </header>
            <form onSubmit={handleSubmit((data) => itemRequest(data))}>
              <section className="modal-card-body">
                <FormField
                  field="itemName"
                  error={errors.itemName?.message}
                  label={DataFields.PENDING_ITEM_NAME_LABEL}
                  validations={Validators.PendingItemName}
                  loading={loading}
                  size="ff-med"
                  register={register}
                />

                <FormField
                  field="controlOwner"
                  error={errors.controlOwner?.message}
                  label={DataFields.CONTROL_OWNER_NAME_LABEL}
                  validations={Validators.ControlOwnerName}
                  loading={loading}
                  size="ff-med"
                  register={register}
                  required={false}
                />

                <div className="field mb-3">
                  <FormField
                    field="description"
                    error={errors.description?.message}
                    label={DataFields.PENDING_ITEM_DESC_LABEL}
                    validations={Validators.PendingItemDesc}
                    loading={loading}
                    size="ff-med"
                    register={register}
                    required={false}
                  />
                </div>
              </section>
              <footer className="modal-card-foot">
                <SubmitAlt
                  submitLabel="Add"
                  altLabel="Cancel"
                  altAction={closeModal}
                  loading={loading}
                />
              </footer>
            </form>
          </div>
        </CSSTransition>
      </div>
    </>,
    document.body
  );
}
