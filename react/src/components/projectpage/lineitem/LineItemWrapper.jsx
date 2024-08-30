//React
import { createContext, useState } from "react";
//Children
import LineItem from "src/components/projectpage/lineitem/LineItem";

//Create unique context for each individual line, and wrap the line in it
export const LineStateContext = createContext();

//Attach unique context to each line item so that deep children have access to state of that specific line item
export default function LineItemWrapper({ line, index }) {
  //State for the data held by line item
  const [lineState, setLineState] = useState({
    checkBoxes: [0, 0, 0], //Value of the checkboxes (0,1,2)
    flagMarker: false, //If a line item is marked as important
    notes: "", //Quick notes column
    pendingItems: 0, //Count of pending items associated with the line item
    index, //Index of line item relative to it's section
    controlNumber: "", //String representation of the control the line item is for
  });

  //State for line's UI related info, not table data
  const [lineUIState, setLineUIState] = useState({
    writingNote: false, //User has clicked and opened note box
    menuOpen: false, //User has opened side menu
    complete: false, //All checkkboxes are complete
    hangingFlag: false,
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
      <LineItem lineItemData={line} />
    </LineStateContext.Provider>
  );
}
