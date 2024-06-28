import { faCircleUser, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";

import handleFormChange from "src/utils/handleFormChange";
import addOpenItem from "src/utils/addOpenItem";
import toTitle from "src/utils/toTitle";
import putOpenItem from "../../utils/putOpenItem";

//Form which can be used to add a new pending item or edit an existing one
export default function PendingItemForm({
  lineID,
  open,
  setOpen,
  setLineState,
  editing = false,
  itemID,
  itemData,
  setItemData,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    controlOwner: "",
    description: "",
  });

  //Wrap generic formhelper to include state func
  function handleChange(event) {
    return handleFormChange(event, setFormData);
  }

  async function submitForm(event) {
    event.preventDefault();
    setLoading(true);

    //For creating a new item
    if (!editing) {
      const response = await addOpenItem(formData, lineID);

      //Check for error, forward status to user
      if (!response.ok) {
        setLoading(false);
        response.errors.forEach((error) => {
          console.error(error);
        });
      } else {
        setLineState((prev) => {
          return { ...prev, pendingItems: prev.pendingItems + 1 };
        });
        closeModal();
      }
    } else {
      //Editing a line item
      const payload = {
        itemName: formData.itemName || itemData.itemName,
        controlOwner: formData.controlOwner || itemData.controlOwner,
        description: formData.description || itemData.description,
      };
      const response = await putOpenItem(formData, itemID);
      if (!response.ok) {
        setLoading(false);
        response.errors.forEach((error) => {
          console.error(error);
        });
      } else {
        closeModal();
      }
      console.log(response.data);
      setItemData((prev) => {
        return {
          ...prev,
          controlOwner: response.data.controlOwner,
          itemName: response.data.itemName,
          description: response.data.description,
        };
      });
      closeModal();
    }
  }

  function closeModal() {
    setOpen(false);
    setLoading(false);
    setFormData({
      itemName: "",
      controlOwner: "",
      description: "",
    });
  }

  return (
    <>
      <div className={`modal${open ? " is-active" : ""}`}>
        <div className="modal-background"></div>
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
          <section className="modal-card-body">
            <form>
              <div className="field mb-3">
                <label className="label">
                  <span className="icon-text">
                    <span className="icon">
                      <FontAwesomeIcon icon={faFile} />
                    </span>
                    <span>Open Item</span>
                  </span>
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="itemName"
                    placeholder={
                      editing
                        ? toTitle(itemData.itemName)
                        : "User Query Screenshot"
                    }
                    disabled={loading}
                    value={formData.itemName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="field mb-3">
                <label className="label">
                  <span className="icon-text">
                    <span className="icon">
                      <FontAwesomeIcon icon={faCircleUser} />
                    </span>
                    <span>Control Owner</span>
                  </span>
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder={
                      editing ? toTitle(itemData.controlOwner) : "Jane Doe"
                    }
                    value={formData.controlOwner}
                    disabled={loading}
                    name="controlOwner"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="field mb-3">
                <label className="label">Description</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    placeholder={
                      editing
                        ? toTitle(itemData.description, true)
                        : "Screenshot from Active Directory showing how user population was generated"
                    }
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </form>
          </section>
          <footer className="modal-card-foot">
            <div className="buttons">
              <button
                className="button is-success"
                type="submit"
                onClick={submitForm}
                disabled={loading}
              >
                Add
              </button>
              <button
                className="button"
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
