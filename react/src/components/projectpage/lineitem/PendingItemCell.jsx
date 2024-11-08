/*-------------------Cleaned up 9/12/24-------------------*/

//React
import { useContext } from "react";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Children
import PendingItemList from "src/components/projectpage/PendingItemList";
import PendingItemIcon from "./PendingItemIcon";

//Cell showing the number of associated pending items if != 0, functions as button to add an item TODO on reimplementing the dynamic icon
export default function PendingItemCell() {
  //Line item data and setters
  const { lineState, lineUIState, setLineUIState, hovering } =
    useContext(LineStateContext);

  return (
    <>
      <div
        // Change background color to green if  line is complete
        className={`flex w-full h-full justify-center items-center transition-all cursor-pointer border-solid border-b-1 border-inherit
        ${lineUIState.complete && "bg-success border-success"}`}
        // Toggle the menu when clicking
        onClick={() => {
          setLineUIState((prev) => ({ ...prev, menuOpen: !prev.menuOpen }));
        }}
      >
        {(hovering ||
          lineUIState.menuOpen ||
          lineUIState.writingNote ||
          lineState.pendingItems > 0) && <PendingItemIcon />}
      </div>
      {/* Animation handled in the component. Some weird structuring here due to using framer motion w/createPortal */}
      {(hovering || lineUIState.menuOpen || lineUIState.writingNote) && (
        <PendingItemList open={lineUIState.menuOpen} />
      )}
    </>
  );
}
