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

  const [helpers, setHelpers] = useState(false);

  //Copy/update the existing notes into the temporary note state
  useEffect(() => {
    setNoteState(lineState.notes);
  }, [lineState.notes]);

  //When no longer writing note, return note to normal zindex
  useEffect(() => {
    if (!lineUIState.writingNote) {
      //TODO!!!!
    }
  }, [lineUIState.writingNote]);

  //Handle clicking into the note box
  function openNote() {
    //Reflect in parent line state
    setLineUIState((prev) => ({ ...prev, writingNote: true }));
    setHelpers(true);

    //Bring note z index above any others
    //TODO

    //Focus the note
    noteRef.current.focus();
  }

  function closeNote() {
    //Unfocus the note
    noteRef.current.blur();

    //Exit the line

    //Remove the helper tags midway thru transition so it looks nice
    setLineUIState((prev) => ({ ...prev, writingNote: false }));
    setTimeout(() => {
      setHelpers(false);
    }, UIVars.NOTE_HELPER_DELAY_MS);
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
    <div className="h-full w-full">
      <textarea
        // className="w-full h-full resize-none p-2 text-sm text-default-500"
        className={`${helpers && "z-20"} overflow-y-hidden ${
          lineUIState.writingNote &&
          "overflow-y-scroll border-3 border-blue-500 shadow-2xl"
        }  p-2 text-sm text-default-500 rounded-xl relative resize-none h-full w-full outline-none`}
        type="text"
        spellcheck="false"
        // Open the note if it is not being used and the line is active
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
