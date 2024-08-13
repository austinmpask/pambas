//React
import { useContext } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Dynamic color/type of icon depending on line state and items
export default function PendingItemIcon() {
  const { lineUIState, lineState } = useContext(LineStateContext);

  return lineUIState.up ? (
    // When the line is up, icon is either a darkened file showing the item count, or a grey  + file icon
    <div className="stacked">
      <span
        className={`icon on-top ${!lineState.pendingItems && "has-text-grey"}`}
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
        <span className="on-top has-text-white" style={{ fontSize: ".8em" }}>
          {lineState.pendingItems}
        </span>
      )}
    </div>
  ) : (
    // If the line is down, icon is invisible, or has a greyed file with count
    lineState.pendingItems !== 0 && (
      <div className="stacked">
        <span
          className={`icon on-top has-text-grey`}
          style={{ fontSize: "1.3em" }}
        >
          <FontAwesomeIcon icon={faFile} />
        </span>
        <span className="on-top has-text-white" style={{ fontSize: ".8em" }}>
          {lineState.pendingItems}
        </span>
      </div>
    )
  );
}
