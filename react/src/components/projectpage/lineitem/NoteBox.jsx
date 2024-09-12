/*-------------------Cleaned up 9/12/24-------------------*/
//React
import { useRef, useState, useEffect, useContext } from "react";

//Children
import TextBoxHelpers from "src/components/TextBoxHelpers";

//Utils
import { UIVars } from "src/utils/validations";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Text area component for quick notes associated with a line item
export default function NoteBox() {
  //Access unique line item context
  const { lineState, lineUIState, setLineState, setLineUIState, setLoading } =
    useContext(LineStateContext);

  //Ref for input box for focus
  const noteRef = useRef(null);

  //Temporary state for the text input, will reflect line state by default unless user is changing it
  const [noteState, setNoteState] = useState(lineState.notes || "");

  //Whether keyboard shortcuts should be shown. Accomodates delay for in/out
  const [helpers, setHelpers] = useState(false);

  //Copy/update the existing notes into the temporary note state
  useEffect(() => {
    setNoteState(lineState.notes);
  }, [lineState.notes]);

  //Handle clicking into the note box
  function openNote() {
    //Reflect in parent line state
    setLineUIState((prev) => ({ ...prev, writingNote: true }));
    setTimeout(() => {
      setHelpers(true);
    }, UIVars.NOTE_HELPER_DELAY_IN_MS);
  }

  function closeNote() {
    //Remove the helper tags midway thru transition so it looks nice
    noteRef.current.blur();
    setLineUIState((prev) => ({ ...prev, writingNote: false }));
    setTimeout(() => {
      setHelpers(false);
    }, UIVars.NOTE_HELPER_DELAY_OUT_MS);
  }

  //Handle key shortcuts for saving/closing note box
  function noteKeyDownHandler(event) {
    //Ctrl enter = save and close
    if (event.keyCode === 13 && event.ctrlKey) {
      setLoading(true);
      setLineState((previous) => {
        return { ...previous, notes: noteState };
      });
      closeNote();
      //Escape = close
    } else if (event.keyCode === 27) {
      setNoteState(lineState.notes);
      closeNote();
    }
  }

  return (
    <div className="h-full w-full bg-transparent">
      <textarea
        className={`${
          // Raise note above project content
          helpers && "z-20"
        } bg-inherit outline-none overflow-y-hidden ${
          lineUIState.writingNote &&
          "overflow-y-scroll border-3 border-blue-500 shadow-2xl rounded-xl bg-slate-50"
        }  p-2 text-sm text-default-500 relative resize-none h-full w-full transition-all ${
          lineUIState.complete && !lineUIState.writingNote && "opacity-50"
        }`}
        type="text"
        spellCheck="false"
        // Open the note on click if not already open
        onClick={() => !lineUIState.writingNote && openNote()}
        ref={noteRef}
        //Hold temporary note state
        value={noteState}
        onChange={(e) => setNoteState(e.target.value)}
        //Hotkeys for exiting or saving
        onKeyDown={noteKeyDownHandler}
      />

      {/* Append helpers to show how to discard or save */}
      {helpers && <TextBoxHelpers content={noteState} />}
    </div>
  );
}
