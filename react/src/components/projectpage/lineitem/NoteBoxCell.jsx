/*-------------------Cleaned up 9/12/24-------------------*/
//React
import { useContext } from "react";

//Children
import NoteBox from "./NoteBox";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Utils
import { UIVars, UserSettings } from "src/utils/validations";

//Container for note input box. This controls the line height, since the line height is relative to the notebox size.
export default function NoteBoxCell() {
  const { lineUIState } = useContext(LineStateContext);

  //TODO: Adjust once settings context & backend implemented

  //Grab the user's collapsed row and expanded settings
  const collapsed = `${
    UIVars.ROW_HEIGHT_PX_OPTIONS[UserSettings.rowHeightPreset]
  }px`;

  const expanded = `${
    UIVars.ROW_EXPANDED_PX_OPTIONS[UserSettings.rowExpandedPreset]
  }px`;
  return (
    <div
      className={`transition-all border-solid border-x-1 border-b-1 border-inherit ${
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
