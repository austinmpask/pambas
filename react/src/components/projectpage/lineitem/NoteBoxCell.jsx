/*-------------------Cleaned up 9/12/24-------------------*/
//React
import { useContext } from "react";

//Children
import NoteBox from "./NoteBox";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Utils
import { UIVars } from "src/utils/validations";

//Contexts
import { UserContext } from "src/context/UserContext";

//Container for note input box. This controls the line height, since the line height is relative to the notebox size.
export default function NoteBoxCell() {
  const { lineUIState } = useContext(LineStateContext);

  const { userData } = useContext(UserContext);

  //Grab the user's collapsed row and expanded settings
  const collapsed = `${
    UIVars.ROW_HEIGHT_PX_OPTIONS[userData.row_height_preset]
  }px`;

  const expanded = `${
    UIVars.ROW_EXPANDED_PX_OPTIONS[userData.row_expanded_preset]
  }px`;
  return (
    <div
      className={`invisible w-0 sm:w-full sm:visible transition-all sm:border-solid sm:border-x-1 sm:border-b-1 ${
        lineUIState.complete && "bg-success border-success"
      } ${lineUIState.writingNote && "p-2"}`}
      // Add the users set height
      style={{ height: lineUIState.writingNote ? expanded : collapsed }}
    >
      {/* Actual input component */}
      <NoteBox />
    </div>
  );
}
