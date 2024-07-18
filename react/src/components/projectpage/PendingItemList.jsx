//React
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";

//Children
import PendingItem from "./PendingItem";
import ItemModal from "src/components/forms/ItemModal";

//Utils
import toastRequest from "src/utils/toastRequest";

export default function PendingItemList({ lineID, numPending, setLineState }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [items, setItems] = useState([]);

  useEffect(() => {
    async function getItems() {
      //Get list of pending items for the lineitem, refresh if there is a change in the amount of items for the line
      await toastRequest({
        method: "GET",
        route: `/lineitem/${lineID}/openitems`,
        successCB: (data) => {
          setItems(data);
        },
        sToastDisabled: true,
      });
    }

    //Only make the request once the required props are populated
    numPending !== undefined && lineID !== undefined && getItems();
  }, [numPending]);

  return createPortal(
    <>
      <ItemModal
        lineID={lineID}
        open={menuOpen}
        setOpen={setMenuOpen}
        setLineState={setLineState}
      />

      <div className="side-card card item-list page-wrapper">
        <div className="card-header has-text-white item-list-header has-background-grey-dark">
          <span className="has-text-weight-medium">{`Open Items`}</span>
          <div className="click-cell" onClick={() => setMenuOpen(true)}>
            <span className="icon">
              <FontAwesomeIcon icon={faFileCirclePlus} />
            </span>
          </div>
        </div>
        <div className="message-body item-list-body">
          {items.map((item, index) => (
            <PendingItem data={item} key={index} setLineState={setLineState} />
          ))}
        </div>
      </div>
    </>,
    document.body
  );
}
