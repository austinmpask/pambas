//React
import { useContext } from "react";

//Children
import NoteBox from "./NoteBox";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Container for note input box
export default function NoteBoxCell({ exit }) {
  const { lineUIState } = useContext(LineStateContext);
  return (
    <div
      className={`border-solid border-x-1 border-inherit ${
        lineUIState.complete && !lineUIState.active && " TODOcomplete-cell"
      }`}
    >
      <NoteBox exit={exit} />
    </div>
  );
}
