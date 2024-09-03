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
      // Change background color to green if  line is complete
      className={`flex justify-center items-center transition-all cursor-pointer border-solid border-b-1 border-inherit
        ${lineUIState.complete && "bg-success border-success"}`}
    >
      <div
        // Toggle the menu when clicking
        onClick={() => {
          setLineUIState((prev) => ({ ...prev, menuOpen: !prev.menuOpen }));
        }}
      >
        {/* Dynamic color/type of icon depending on line state and items */}
        <PendingItemIcon />
      </div>

      <PendingItemList />
    </div>
  );
}
