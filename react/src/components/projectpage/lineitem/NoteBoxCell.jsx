//React
import { useContext } from "react";

//Children
import NoteBox from "./NoteBox";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Container for note input box
export default function NoteBoxCell() {
  const { lineUIState } = useContext(LineStateContext);
  return (
    <div
      className={`transition-all border-solid border-x-1 border-b-1 border-inherit ${
        lineUIState.complete && "bg-success border-success"
      } ${lineUIState.writingNote ? "h-[120px] p-2" : "h-[60px]"}`}
    >
      <NoteBox />
    </div>
  );
}
