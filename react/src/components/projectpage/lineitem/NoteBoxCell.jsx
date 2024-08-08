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
      className={`cell line-item-cell centered-cell ${
        lineUIState.complete && !lineUIState.active && " complete-cell"
      }`}
    >
      <NoteBox exit={exit} />
    </div>
  );
}
