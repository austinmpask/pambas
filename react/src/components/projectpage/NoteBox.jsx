import TextBoxHelpers from "src/components/TextBoxHelpers";
import { useRef, useState, useEffect } from "react";

export default function NoteBox({
  writingNote,
  setWritingNote,
  lineState,
  setLineState,
  setLoading,
  active,
  exit,
  complete,
}) {
  //Ref for input box for focus
  const noteRef = useRef(null);
  const boxRef = useRef(null);

  //Keep track of contents of note box for the item
  const [noteState, setNoteState] = useState(lineState.notes || "");

  //When no longer writing note, return note to normal zindex
  useEffect(() => {
    if (!writingNote) {
      noteRef.current.classList.remove("top");
    }
  }, [writingNote]);

  function openNote() {
    setWritingNote(true);
    //Expand the row for visibility
    boxRef.current.parentNode.classList.add("expanded");

    //Bring note z index above any others
    noteRef.current.classList.add("top");

    //Focus the note
    noteRef.current.focus();
  }

  function closeNote() {
    //Collapse line item row, unfocus the note
    boxRef.current.parentNode.classList.remove("expanded");
    noteRef.current.blur();
    boxRef.current.blur();
    exit();

    //Remove the helper tags midway thru transition so it looks nice
    setTimeout(() => {
      setWritingNote(false);
    }, 50);
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
      className={`note-cell ${active && " note-cell-active "} ${
        complete && !active && " complete-cell"
      }`}
      ref={boxRef}
    >
      <div className={`note-wrapper ${writingNote && " shrink"}`}>
        <textarea
          className={`input is-small notes-input has-text-grey ${
            active && "active-text"
          } ${complete && !active && " complete-cell min-text"}`}
          type="text"
          onClick={() => active && !writingNote && openNote()}
          ref={noteRef}
          value={noteState}
          onChange={(e) => setNoteState(e.target.value)}
          onKeyDown={noteKeyDownHandler}
          disabled={!active}
        />
        {writingNote && <TextBoxHelpers content={noteState} />}
      </div>
    </div>
  );
}
