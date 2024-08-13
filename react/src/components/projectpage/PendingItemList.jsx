//React
import { useContext, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { createPortal } from "react-dom";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus, faFish } from "@fortawesome/free-solid-svg-icons";

//Children
import PendingItem from "./PendingItem";
import ItemModal from "src/components/forms/ItemModal";

//Contexts
import { LineStateContext } from "./lineitem/LineItemWrapper";

//Utils
import toastRequest from "src/utils/toastRequest";
import { UIVars } from "src/utils/validations";

//List of all pending items for a line item/message if none
export default function PendingItemList() {
  //Consume line context
  const { lineState } = useContext(LineStateContext);

  //State for presence of the add item modal
  const [modalOpen, setModalOpen] = useState(false);

  //Track a list of open items, initially set to false to allow for conditional rendering w/o visual glitch with CSSTransition
  const [items, setItems] = useState(false);

  //Get list of pending items for the lineitem, refresh if there is a change in the amount of items for the line
  useEffect(() => {
    async function getItems() {
      await toastRequest({
        method: "GET",
        route: `/lineitem/${lineState.id}/openitems`,
        successCB: (data) => {
          setItems(data);
        },
        sToastDisabled: true,
      });
    }

    //Only make the request once the context has data from db (explicit check = undefined bc 0 is acceptable)
    lineState.pendingItems !== undefined &&
      lineState.id !== undefined &&
      getItems();
  }, [lineState.pendingItems]);

  return createPortal(
    <>
      {/* Modal for adding/editing pending items */}
      <ItemModal open={modalOpen} setOpen={setModalOpen} />

      {/* Pending item list card */}
      <div className="side-card card item-list page-wrapper default-body-background">
        {/* CARD HEADER */}
        <div className="card-header has-text-white item-list-header default-header-color">
          <div>
            <span className="has-text-weight-medium ">
              {lineState.controlNumber}
            </span>
            <span className="has-text-weight-medium">
              &nbsp;&nbsp;Open Items
            </span>
          </div>
          {/* Add item button */}
          <button
            className="click-cell"
            // Open new item modal
            onClick={() => setModalOpen(true)}
          >
            <span className="icon">
              <FontAwesomeIcon icon={faFileCirclePlus} />
            </span>
          </button>
        </div>

        {/* CARD BODY */}
        <div
          className="item-list-body"
          style={
            items.length
              ? { justifyContent: "flex-start" }
              : { justifyContent: "center", minHeight: "200px" }
          }
        >
          {/* Populate the list of open items w/short animation */}
          <CSSTransition
            in={items && items.length}
            unmountOnExit
            classNames={"item-list"}
            timeout={UIVars.PENDING_ITEM_IN_ANIM_MS}
          >
            {/* Create components for each of the line items */}
            <div style={{ width: "100%" }}>
              {items &&
                items.map((item, index) => (
                  <PendingItem data={item} key={index} />
                ))}
            </div>
          </CSSTransition>

          {/* Case of no pending items */}
          {items && !items.length && (
            <>
              <span className="icon mb-3 has-text-grey-light">
                <FontAwesomeIcon size="xl" icon={faFish} />
              </span>
              <label className="has-text-weight-medium has-text-grey-light">
                Nothing here!
              </label>
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
