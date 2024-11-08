/*-------------------Cleaned up 11/8/24-------------------*/
//React
import { useRef, useState, useEffect, useContext, useCallback } from "react";

//Children
import TextBoxHelpers from "src/components/TextBoxHelpers";

//Utils
import { UIVars } from "src/utils/validations";
import Mousetrap from "mousetrap";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Text area component for quick notes associated with a line item. Closed with ESC or unfocus, save content w/ enter
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

  const handleSave = useCallback(() => {
    //Change linestate which will make request to save notes
    setLoading(true);
    setLineState((previous) => ({
      ...previous,
      notes: noteState,
    }));
    //Remove keybinds & close note
    noteRef.current.blur();
  }, [noteState, setLoading, setLineState, setLineUIState, setHelpers]);

  //Blur on escape, need to use this to fix device compatibility issues
  const handleEscape = useCallback(() => {
    noteRef.current.blur();
  }, []);

  //Add keybinds when note is opened
  useEffect(() => {
    if (lineUIState.writingNote) {
      Mousetrap.bind("enter", handleSave);
      Mousetrap.bind("esc", handleEscape);
    }
  }, [lineUIState.writingNote, handleSave, handleEscape]);

  //Handle clicking into the note box
  function openNote() {
    //Reflect in parent line state
    setLineUIState((prev) => ({ ...prev, writingNote: true }));
    setTimeout(() => {
      setHelpers(true);
    }, UIVars.NOTE_HELPER_DELAY_IN_MS);
  }

  // Blur used for some devices not escaping when ESC pressed
  function handleBlur() {
    //Close note box
    setNoteState(lineState.notes);
    setLineUIState((prev) => ({ ...prev, writingNote: false }));
    setTimeout(() => {
      setHelpers(false);
    }, UIVars.NOTE_HELPER_DELAY_OUT_MS);

    //Remove keybinds
    Mousetrap.unbind("enter");
    Mousetrap.unbind("esc");
  }

  return (
    <div className="h-full w-full bg-transparent">
      <textarea
        className={`${
          // Raise note above project content
          helpers && "z-20"
        } bg-inherit outline-none overflow-y-hidden ${
          lineUIState.writingNote &&
          "mousetrap overflow-y-scroll scrollbar-hidden border-3 border-blue-500 shadow-2xl rounded-xl bg-slate-50"
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
        onBlur={handleBlur}
      />

      {/* Append helpers to show how to discard or save */}
      {helpers && <TextBoxHelpers content={noteState} />}
    </div>
  );
}
