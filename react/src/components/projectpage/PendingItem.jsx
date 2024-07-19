//React
import { useEffect, useState } from "react";

//Icons
import {
  faCircleUser,
  faCircleXmark,
  faEnvelope,
  faFile,
  faPaperPlane,
  faSquarePen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Utils
import toastRequest from "src/utils/toastRequest";
import toTitle from "src/utils/toTitle";
import shortDate from "src/utils/shortDate";

//Children
import ItemModal from "src/components/forms/ItemModal";

//Component to summarize details of a given pending/open item
export default function PendingItem({ data, setLineState, setHeaderStats }) {
  //State for the item data
  const [itemData, setItemData] = useState({ ...data });

  //Hovering state for title to indicate editing
  const [hovering, setHovering] = useState(false);

  //State to control the visibility of modal
  const [editing, setEditing] = useState(false);

  //Reflect any updates from db in item state
  useEffect(() => {
    setItemData({ ...data });
  }, [data]);

  //Make request to delete open item
  async function deleteItem() {
    await toastRequest({
      method: "DELETE",
      route: `/openitem/${itemData.id}`,
      successCB: () => {
        //Update the lending item counts for entire project and individual line state
        setLineState((prev) => ({
          ...prev,
          pendingItems: prev.pendingItems - 1,
        }));

        setHeaderStats((prev) => ({
          ...prev,
          openItems: prev.openItems - 1,
        }));
      },
      success: "Item removed!",
    });
  }

  //Change the followup date for the item to the present date/time
  async function followup() {
    await toastRequest({
      method: "PUT",
      route: `/openitem/${itemData.id}/followup`,
      successCB: (data) => {
        setItemData((prev) => {
          return { ...prev, lastContactDate: data };
        });
      },
      success: "Follow-up date noted!",
    });
  }

  return (
    <>
      <div className="message mb-4 pending-item-card">
        <ItemModal
          lineID={itemData.lineItemID}
          open={editing}
          setOpen={setEditing}
          setLineState={setLineState}
          editing={true}
          itemID={itemData.id}
          itemData={itemData}
          setItemData={setItemData}
        />
        <div className="message-header pending-item-header has-background-grey-dark has-text-white">
          <div
            className="pending-item-title"
            onClick={() => setEditing(true)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faFile} />
              </span>
              <span className="has-text-weight-medium">
                {toTitle(itemData.itemName)}
              </span>
              {hovering && (
                <span className="icon">
                  <FontAwesomeIcon icon={faSquarePen} />
                </span>
              )}
            </span>
          </div>
          <span
            className="icon has-text-danger tag-button"
            onClick={deleteItem}
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </span>
        </div>

        <div className="message-body p-3">
          <div className="content is-small mb-4 item-body">
            <label className="pl-1 pb-1 has-text-weight-bold">
              Description
            </label>
            <div className="description-box">
              <p>{toTitle(itemData.description, true)}</p>
            </div>

            <div className="contact-card">
              <div className="pb-1">
                <label className="has-text-weight-bold">
                  <span className="icon-text">
                    <span className="icon">
                      <FontAwesomeIcon size="xl" icon={faCircleUser} />
                    </span>
                    <span>{toTitle(itemData.controlOwner)}</span>
                  </span>
                </label>
              </div>

              <div className="contact-buttons">
                <span className="tag contact-tag">
                  <span className="icon-text">
                    <span className="icon">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <span>
                      {itemData.lastContactDate
                        ? shortDate(itemData.lastContactDate)
                        : "No contact"}
                    </span>
                  </span>
                </span>
                <span className="tag is-success tag-button" onClick={followup}>
                  <span className="icon">
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="item-footer has-text-grey-light has-background-light">
          <p>{`${shortDate(itemData.createdAt)}`}</p>
        </div>
      </div>
    </>
  );
}
