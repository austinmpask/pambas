/*-------------------Cleaned up 9/12/24-------------------*/

//React
import { useContext, useEffect } from "react";

//Contexts
import { LineStateContext } from "./LineItemWrapper";
import { HeaderStatsContext } from "src/pages/ProjectPage";

//Children
import PendingItemList from "src/components/projectpage/PendingItemList";
import PendingItemIcon from "./PendingItemIcon";

//Cell showing the number of associated pending items if != 0, functions as button to add an item TODO on reimplementing the dynamic icon
export default function PendingItemCell() {
  //Line item data and setters
  const { lineRef, lineState, lineUIState, setLineUIState, hovering } =
    useContext(LineStateContext);

  //Consume headerStats which stores what line is being used
  const { headerStats, setHeaderStats } = useContext(HeaderStatsContext);

  //Close menu if another line gets selected
  useEffect(() => {
    if (headerStats.selectedLine !== lineRef.current) {
      setLineUIState((prev) => ({ ...prev, menuOpen: false }));
    }
  }, [headerStats.selectedLine]);

  return (
    <>
      <div
        // Change background color to green if  line is complete
        className={`flex w-full h-full justify-center items-center transition-all cursor-pointer border-solid border-b-1 border-inherit
        ${lineUIState.complete && "bg-success border-success"}`}
        // Toggle the menu when clicking
        onClick={() => {
          //If no line is selected, then select this line and open the menu. Close and switch to other line if different one selected
          if (headerStats.selectedLine === lineRef.current) {
            setHeaderStats((prev) => ({
              ...prev,
              selectedLine: null,
            }));
            setLineUIState((prev) => ({ ...prev, menuOpen: false }));
          } else {
            setHeaderStats((prev) => ({
              ...prev,
              selectedLine: lineRef.current,
            }));
            setLineUIState((prev) => ({ ...prev, menuOpen: true }));
          }
        }}
      >
        {(hovering ||
          lineUIState.menuOpen ||
          lineUIState.writingNote ||
          lineState.pendingItems > 0) && <PendingItemIcon />}
      </div>
      {/* Animation handled in the component. Some weird structuring here due to using framer motion w/createPortal */}
      {(hovering || lineUIState.menuOpen || lineUIState.writingNote) && (
        <PendingItemList />
      )}
    </>
  );
}
