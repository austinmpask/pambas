import {
  faCircleUser,
  faCircleXmark,
  faEnvelope,
  faFile,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";

import toTitle from "src/utils/toTitle";
import shortDate from "src/utils/shortDate";
import deleteOpenItem from "src/utils/deleteOpenItem";
import followupOnItem from "src/utils/followupOnItem";

export default function PendingItem({ data, setLineState }) {
  const [itemData, setItemData] = useState({ ...data });

  useEffect(() => {
    setItemData({ ...data });
  }, [data]);

  async function deleteItem() {
    const response = await deleteOpenItem(data.id);

    if (!response.ok) {
      response.errors.forEach((error) => {
        console.error(error);
      });
    } else {
      setLineState((prev) => {
        return { ...prev, pendingItems: prev.pendingItems - 1 };
      });
    }
  }

  async function followup() {
    const response = await followupOnItem(data.id);

    if (!response.ok) {
      response.errors.forEach((error) => {
        console.error(error);
      });
    } else {
      setItemData((prev) => {
        return { ...prev, lastContactDate: response.data };
      });
    }
  }
  return (
    <article className="message mb-2 pending-item-card">
      <div className="message-header pending-item-header">
        <span className="icon-text">
          <span className="icon">
            <FontAwesomeIcon icon={faFile} />
          </span>
          <span className="">{toTitle(itemData.itemName)}</span>
        </span>
        <span className="icon tag-button" onClick={deleteItem}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </span>
      </div>

      <div className="message-body">
        <div className="content is-small mb-4">
          <p>{`Created at: ${shortDate(itemData.createdAt)}`}</p>
          <h4>
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faCircleUser} />
              </span>
              <span>{toTitle(itemData.controlOwner)}</span>
            </span>
          </h4>
          <p>{toTitle(itemData.description, true)}</p>
        </div>
        <div className="pending-item-footer">
          <span className="tag is-dark">
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
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faPaperPlane} />
              </span>
              <span>Follow Up</span>
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
