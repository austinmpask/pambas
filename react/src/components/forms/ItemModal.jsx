//React
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

//Utils
import toastRequest from "src/utils/toastRequest";
import { DataFields, Validators } from "src/utils/validations";

//Form
import { useForm } from "react-hook-form";
import FormField from "src/components/forms/components/FormField";
import SubmitAlt from "src/components/forms/components/SubmitAlt";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faFile,
  faFish,
  faRectangleXmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

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
    watch,
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
      <CSSTransition
        in={open}
        unmountOnExit
        timeout={1000}
        classNames={"modal"}
      >
        <div className={`modal${open ? " is-active" : ""}`}>
          <div className="modal-background"></div>
          <div className="modal-card">
            <div className="modal-card-head default-sub-header-color">
              <h2 className="title is-5 has-text-weight-medium has-text-white">{`${
                editing ? "Edit " : "Add "
              }Open Item`}</h2>
              <button
                className="has-text-danger"
                aria-label="close"
                disabled={loading}
                onClick={closeModal}
              >
                <FontAwesomeIcon size="lg" icon={faRectangleXmark} />
              </button>
            </div>
            <form onSubmit={handleSubmit((data) => itemRequest(data))}>
              <section className="modal-card-body">
                <div className="field-icon">
                  <div
                    className={`mr-3 field-icon-cont ${
                      watch("itemName")
                        ? "has-text-success"
                        : "has-text-grey-light"
                    }`}
                  >
                    <FontAwesomeIcon size="2x" icon={faFile} />
                  </div>
                  <FormField
                    field="itemName"
                    error={errors.itemName?.message}
                    label={DataFields.PENDING_ITEM_NAME_LABEL}
                    validations={Validators.PendingItemName}
                    loading={loading}
                    size="ff-med"
                    register={register}
                  />
                </div>

                <div className="field-icon">
                  <div
                    className={`mr-3 field-icon-cont ${
                      watch("controlOwner")
                        ? "has-text-success"
                        : "has-text-grey-light"
                    }`}
                  >
                    {watch("controlOwner") ? (
                      <FontAwesomeIcon size="2x" icon={faFish} />
                    ) : (
                      <FontAwesomeIcon size="2x" icon={faUser} />
                    )}
                  </div>
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
                </div>

                <div className="field-icon">
                  <div
                    className={`mr-3 field-icon-cont ${
                      watch("description")
                        ? "has-text-success"
                        : "has-text-grey-light"
                    }`}
                  >
                    <FontAwesomeIcon size="2x" icon={faBarsStaggered} />
                  </div>
                  <FormField
                    field="description"
                    error={errors.description?.message}
                    label={DataFields.PENDING_ITEM_DESC_LABEL}
                    validations={Validators.PendingItemDesc}
                    loading={loading}
                    size="ff-med"
                    register={register}
                    required={false}
                    type="textarea"
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
        </div>
      </CSSTransition>
    </>,
    document.body
  );
}
