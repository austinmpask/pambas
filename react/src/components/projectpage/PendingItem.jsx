//React
import { useEffect, useState } from "react";

//Icons
import {
  faBinoculars,
  faBook,
  faCircleUser,
  faCircleXmark,
  faClipboardList,
  faEnvelope,
  faFile,
  faFish,
  faImage,
  faMagnifyingGlass,
  faPaperPlane,
  faPenToSquare,
  faPuzzlePiece,
  faQuestion,
  faRectangleXmark,
  faReply,
  faSquarePen,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Utils
import toastRequest from "src/utils/toastRequest";
import toTitle from "src/utils/toTitle";
import shortDate from "src/utils/shortDate";
import { DataFields } from "../../utils/validations";

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

  const [icon, setIcon] = useState(faFile);

  const [contactIcon, setContactIcon] = useState(faPenToSquare);

  //Reflect any updates from db in item state
  useEffect(() => {
    setItemData({ ...data });
  }, [data]);

  useEffect(() => {
    //Assign an appropriate file icon for the type of request

    //Standardize title words
    const title = itemData.itemName
      .split(" ")
      .map((word) => word.toLowerCase());

    //Order lists in reverse specificity
    const comparisonLists = [
      [DataFields.IMAGE_KEYWORDS, faImage],
      [DataFields.LOG_KEYWORDS, faBook],
      [DataFields.SAMPLE_KEYWORDS, faPuzzlePiece],
      [DataFields.POPULATION_KEYWORDS, faUsers],
      [DataFields.QUERY_KEYWORDS, faBinoculars],
    ];

    //Traverse the lists in order of reverse specificity (not as quick but makes for easy logic in this context)
    comparisonLists.forEach(([list, icon]) => {
      title.forEach((word) => {
        if (list.includes(word)) {
          setIcon(icon);
        }
      });
    });

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
          <div className="item-footer has-text-grey-light has-background-light">
            <p>{`${shortDate(itemData.createdAt)}`}</p>
          </div>
        </div>
      </div>
    </>
  );
}
