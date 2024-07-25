//React
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmile,
  faFileCirclePlus,
  faPaw,
} from "@fortawesome/free-solid-svg-icons";
//Children
import PendingItem from "./PendingItem";
import ItemModal from "src/components/forms/ItemModal";

//Utils
import toastRequest from "src/utils/toastRequest";
import { CSSTransition } from "react-transition-group";

export default function PendingItemList({
  lineID,
  numPending,
  setLineState,
  setHeaderStats,
  controlNumber,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  //Track a list of open items, initially set to false to allow for conditional rendering w/o visual glitch with CSSTransition
  const [items, setItems] = useState(false);

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
    <div className="side-card card item-list page-wrapper default-body-background">
      <ItemModal
        lineID={lineID}
        open={modalOpen}
        setOpen={setModalOpen}
        setLineState={setLineState}
        setHeaderStats={setHeaderStats}
      />
      <div className="card-header has-text-white item-list-header default-header-color">
        <span className="has-text-weight-medium">{controlNumber}</span>
        <div className="click-cell" onClick={() => setModalOpen(true)}>
          <span className="icon">
            <FontAwesomeIcon icon={faFileCirclePlus} />
          </span>
        </div>
      </div>

      <div
        className="item-list-body"
        style={
          items.length
            ? { justifyContent: "flex-start" }
            : { justifyContent: "center" }
        }
      >
        <CSSTransition
          in={items && items.length}
          unmountOnExit
          classNames={"item-list"}
          timeout={300}
        >
          <div style={{ width: "100%" }}>
            {items &&
              items.map((item, index) => (
                <PendingItem
                  data={item}
                  key={index}
                  setLineState={setLineState}
                  setHeaderStats={setHeaderStats}
                />
              ))}
          </div>
        </CSSTransition>

        {items && !items.length && (
          <>
            <span className="icon mb-3 has-text-grey-light">
              <FontAwesomeIcon size="xl" icon={faPaw} />
            </span>
            <label className="has-text-weight-medium has-text-grey-light">
              Nothing here!
            </label>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
