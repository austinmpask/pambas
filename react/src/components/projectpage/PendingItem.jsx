//React
import { useContext, useEffect, useState } from "react";

//Icons
import {
  faCircleUser,
  faFile,
  faFish,
  faPenToSquare,
  faRectangleXmark,
  faReply,
  faSquarePen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Utils
import toastRequest from "src/utils/toastRequest";
import toTitle from "src/utils/toTitle";
import shortDate from "src/utils/shortDate";
import pendingItemIcon from "src/utils/pendingItemIcon";

//Children
import ItemModal from "src/components/forms/ItemModal";

//Contexts
import { LineStateContext } from "./lineitem/LineItemWrapper";
import { HeaderStatsContext } from "src/pages/ProjectPage";

//Component to summarize details of a given pending/open item
export default function PendingItem({ data }) {
  //Consume line context
  const { setLineState } = useContext(LineStateContext);

  //Setter for project summary stats in the header
  const { setHeaderStats } = useContext(HeaderStatsContext);

  //State for the item data
  const [itemData, setItemData] = useState({ ...data });

  //Hovering state for title to indicate editing
  const [hovering, setHovering] = useState(false);

  //State to control the visibility of editing modal
  const [editing, setEditing] = useState(false);

  //Icons for the item card
  const [icon, setIcon] = useState(faFile);
  const [contactIcon, setContactIcon] = useState(faPenToSquare);

  //Reflect any updates from db in item state
  useEffect(() => {
    setItemData({ ...data });
  }, [data]);

  //Assign appropriate icons for the type of request/contact date
  useEffect(() => {
    //Item icon
    setIcon(() => pendingItemIcon(itemData.itemName));

    //Contact icon
    itemData.lastContactDate
      ? setContactIcon(faReply)
      : setContactIcon(faPenToSquare);
  }, [itemData]);

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
      {/* Modal for editing an open item */}
      <ItemModal
        open={editing}
        setOpen={setEditing}
        editing={true}
        itemID={itemData.id}
        itemData={itemData}
        setItemData={setItemData}
      />

      {/* Item card */}
      <div className="message mb-4 pending-item-card">
        {/* HEADER */}
        <div className="message-header pending-item-header default-sub-header-color has-text-white">
          <div
            className="pending-item-title"
            onClick={() => setEditing(true)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <span className="icon-text">
              <span className="icon" style={{ fontSize: "1.2em" }}>
                <FontAwesomeIcon icon={icon} />
              </span>
              <span className="has-text-weight-medium">
                &nbsp;{toTitle(itemData.itemName)}
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
            <FontAwesomeIcon icon={faRectangleXmark} />
          </span>
        </div>

        {/* BODY */}
        <div className="message-body item-card-body">
          <div className="content is-small mb-4 item-body">
            {itemData.description && (
              <>
                <label className="pl-1 pb-1 has-text-weight-bold has-text-grey-dark">
                  Description
                </label>
                <div className="description-box">
                  <p>{toTitle(itemData.description, true)}</p>
                </div>
              </>
            )}

            <div className="contact-card">
              <div className="contact-buttons has-text-grey">
                {itemData.controlOwner ? (
                  <span className="icon-text">
                    <span className="icon">
                      <FontAwesomeIcon size="xl" icon={faCircleUser} />
                    </span>
                    <span>{toTitle(itemData.controlOwner)}</span>
                  </span>
                ) : (
                  <span className="icon-text has-text-grey-light">
                    <span className="icon">
                      <FontAwesomeIcon size="xl" icon={faFish} />
                    </span>
                    No owner
                  </span>
                )}
                <span className="tag tag-button" onClick={followup}>
                  <span className="icon-text">
                    {itemData.lastContactDate
                      ? shortDate(itemData.lastContactDate)
                      : "Note followup date"}
                    <span className="icon">
                      <FontAwesomeIcon icon={contactIcon} />
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* FOOTER */}
          <div className="item-footer has-text-grey-light has-background-light">
            <p>{`${shortDate(itemData.createdAt)}`}</p>
          </div>
        </div>
      </div>
    </>
  );
}
