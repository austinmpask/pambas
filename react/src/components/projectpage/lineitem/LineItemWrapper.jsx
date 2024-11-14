/*-------------------Cleaned up 9/11/24-------------------*/
//React
import { createContext, useState, useRef } from "react";
//Children
import LineItem from "src/components/projectpage/lineitem/LineItem";

//Create unique context for each individual line, and wrap the line in it
export const LineStateContext = createContext();

//Attach unique context to each line item so that deep children have access to state of that specific line item
export default function LineItemWrapper({ line, index, end }) {
  //State for the data held by line item
  const [lineState, setLineState] = useState({
    checkBoxes: [0, 0, 0], //Value of the checkboxes (0,1,2)
    flagMarker: false, //If a line item is marked as important
    notes: "", //Quick notes column
    pendingItems: 0, //Count of pending items associated with the line item
    index, //Index of line item relative to it's section
    controlNumber: "", //String representation of the control the line item is for
  });

  // Ref for the line item. Used for tracking if user is interacting with more than 1 line item at once
  const lineRef = useRef(null);

  //State for line's UI related info, not table data
  const [lineUIState, setLineUIState] = useState({
    writingNote: false, //User has clicked and opened note box
    menuOpen: false, //User has opened side menu
    complete: false, //All checkkboxes are complete
  });

  //Loading for visuals or lockouts
  const [loading, setLoading] = useState(false);

  //State for if user is mousing over a line item
  const [hovering, setHovering] = useState(false);

  //Wrap the line item in its unique context
  return (
    <LineStateContext.Provider
      value={{
        lineState,
        setLineState,
        lineUIState,
        setLineUIState,
        loading,
        setLoading,
        hovering,
        setHovering,
        lineRef,
        end,
      }}
    >
      <LineItem ref={lineRef} lineItemData={line} />
    </LineStateContext.Provider>
  );
}
