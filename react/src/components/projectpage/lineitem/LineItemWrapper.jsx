//React
import { createContext, useState } from "react";
//Children
import LineItem from "src/components/projectpage/lineitem/LineItem";

//Create unique context for each individual line, and wrap the line in it
export const LineStateContext = createContext();

export default function LineItemWrapper({ line, index, setHeaderStats }) {
  //State for the data held by line item
  const [lineState, setLineState] = useState({
    checkBoxes: [0, 0, 0],
    flagMarker: false,
    notes: "",
    pendingItems: 0,
    index,
    controlNumber: "",
  });

  //State for line's UI related info, not table data
  const [lineUIState, setLineUIState] = useState({
    active: false, //State to track if this line item is selected and active
    hoveringHeld: false, //Track if the component was hovered by user for xxx ms
    up: false, //Line item has COMPLETED the animation to being selected/being deselected
    writingNote: false, //User has clicked and opened note box
    menuOpen: false, //User has opened side menu
    complete: false, //All checkkboxes are complete
    hangingFlag: false,
    css: "hoverable-line",
  });

  //Loading for visuals or lockouts
  const [loading, setLoading] = useState(false);

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
      }}
    >
      <LineItem setHeaderStats={setHeaderStats} lineItemData={line} />
    </LineStateContext.Provider>
  );
}
