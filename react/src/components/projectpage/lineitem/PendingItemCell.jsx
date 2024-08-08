import PendingItemList from "src/components/projectpage/PendingItemList";

import { CSSTransition } from "react-transition-group";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faFile,
  faFileCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
export default function PendingItemCell({
  lineUIState,
  setLineUIState,
  lineState,
  setLineState,
  setHeaderStats,
  lineID,
  controlNumber,
}) {
  return (
    <div
      className={`cell line-item-cell centered-cell item-cell  ${
        lineUIState.complete && !lineUIState.active && " complete-cell"
      }`}
    >
      <div
        className={lineUIState.active && "click-cell p-5"}
        onClick={() => {
          if (lineUIState.active) {
            setLineUIState((prev) => ({ ...prev, menuOpen: !prev.menuOpen }));
          }
        }}
      >
        {lineUIState.up ? (
          <div className="stacked">
            <span
              className={`icon on-top ${
                !lineState.pendingItems && "has-text-grey"
              }`}
              style={
                lineUIState.active && !lineState.pendingItems
                  ? { fontSize: "1.3em", opacity: "1" }
                  : { fontSize: "1.3em", opacity: lineState.pendingItems }
              }
            >
              <FontAwesomeIcon
                icon={lineState.pendingItems ? faFile : faFileCirclePlus}
              />
            </span>
            {lineState.pendingItems !== 0 && (
              <span
                className="on-top has-text-white"
                style={{ fontSize: ".8em" }}
              >
                {lineState.pendingItems}
              </span>
            )}
          </div>
        ) : (
          lineState.pendingItems !== 0 && (
            <div className="stacked">
              <span
                className={`icon on-top has-text-grey`}
                style={{ fontSize: "1.3em" }}
              >
                <FontAwesomeIcon icon={faFile} />
              </span>
              <span
                className="on-top has-text-white"
                style={{ fontSize: ".8em" }}
              >
                {lineState.pendingItems}
              </span>
            </div>
          )
        )}
      </div>

      <CSSTransition
        in={lineUIState.menuOpen}
        unmountOnExit
        timeout={65}
        classNames="item-card"
      >
        <PendingItemList
          lineID={lineID}
          numPending={lineState.pendingItems}
          setLineState={setLineState}
          setHeaderStats={setHeaderStats}
          controlNumber={controlNumber}
        />
      </CSSTransition>
    </div>
  );
}
