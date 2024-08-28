//React
import { useContext } from "react";
import { CSSTransition } from "react-transition-group";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Children
import PendingItemList from "src/components/projectpage/PendingItemList";
import PendingItemIcon from "./PendingItemIcon";

//Utils
import { UIVars } from "src/utils/validations";

//Cell showing the number of associated pending items if != 0, functions as button to add an item
export default function PendingItemCell() {
  //Line item data and setters
  const { lineUIState, setLineUIState } = useContext(LineStateContext);

  return (
    <div
      // Change background color to green if !active && line is complete
      className={`flex justify-center items-center ${
        lineUIState.complete && !lineUIState.active && "TODOcomplete-cell"
      }`}
    >
      <div
        // Adjust cursor for line being active
        className={lineUIState.active && ""}
        // Toggle the menu when clicking
        onClick={() => {
          if (lineUIState.active) {
            setLineUIState((prev) => ({ ...prev, menuOpen: !prev.menuOpen }));
          }
        }}
      >
        {/* Dynamic color/type of icon depending on line state and items */}
        <PendingItemIcon />
      </div>

      {/* Transition handled here b/c gets messy with PendingItemList returning createPortal */}
      <CSSTransition
        in={lineUIState.menuOpen}
        unmountOnExit
        timeout={UIVars.PENDING_MENU_OPEN_ANIM_MS}
        classNames="item-card"
      >
        {/* Side menu for pending/open items */}
        <PendingItemList />
      </CSSTransition>
    </div>
  );
}
