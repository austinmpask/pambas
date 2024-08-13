//React
import { useRef, useState, useEffect, useContext } from "react";

//Children
import TextBoxHelpers from "src/components/TextBoxHelpers";

//Utils
import { UIVars } from "src/utils/validations";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Text area component for quick notes associated with a line item
export default function NoteBox({ exit }) {
  //Access unique line item context
  const { lineState, lineUIState, setLineState, setLineUIState, setLoading } =
    useContext(LineStateContext);

  //Ref for input box for focus
  const noteRef = useRef(null);

  //Temporary state for the text input, will reflect line state by default unless user is changing it
  const [noteState, setNoteState] = useState(lineState.notes || "");

  //Copy/update the existing notes into the temporary note state
  useEffect(() => {
    setNoteState(lineState.notes);
  }, [lineState.notes]);

  //When no longer writing note, return note to normal zindex
  useEffect(() => {
    if (!lineUIState.writingNote) {
      noteRef.current.classList.remove("top");
    }
  }, [lineUIState.writingNote]);

  //Handle clicking into the note box
  function openNote() {
    //Reflect in parent line state
    setLineUIState((prev) => ({ ...prev, writingNote: true }));

    //Bring note z index above any others
    noteRef.current.classList.add("top");

    //Focus the note
    noteRef.current.focus();
  }

  function closeNote() {
    //Unfocus the note
    noteRef.current.blur();

    //Exit the line
    exit();

    //Remove the helper tags midway thru transition so it looks nice
    setTimeout(() => {
      setLineUIState((prev) => ({ ...prev, writingNote: false }));
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
    <div
      className={`note-cell ${lineUIState.active && " note-cell-active "} ${
        lineUIState.complete && !lineUIState.active && " complete-cell"
      }`}
      // Adjust height based on if the note is active or not
      style={
        lineUIState.writingNote
          ? { minHeight: `${UIVars.NOTE_EXPANDED_HEIGHT_PX}px` }
          : { minHeight: `${UIVars.NOTE_COLLAPSED_HEIGHT_PX}px` }
      }
    >
      <div
        // Shrink the conatiner slightly from the edges when it is in use
        className={`note-wrapper ${lineUIState.writingNote && "shrink"}`}
      >
        <textarea
          className={`input is-small notes-input has-text-grey ${
            lineUIState.active && "active-text"
          } ${lineUIState.writingNote && " input-attention"} ${
            lineUIState.complete &&
            !lineUIState.active &&
            " complete-cell min-text"
          }`}
          type="text"
          // Open the note if it is not being used and the line is active
          onClick={() =>
            lineUIState.active && !lineUIState.writingNote && openNote()
          }
          ref={noteRef}
          //Hold temporary note state
          value={noteState}
          onChange={(e) => setNoteState(e.target.value)}
          //Hotkeys for exiting or saving
          onKeyDown={noteKeyDownHandler}
          disabled={!lineUIState.active}
        />

        {/* Append helpers to show how to discard or save */}
        {lineUIState.writingNote && <TextBoxHelpers content={noteState} />}
      </div>
    </div>
  );
}
