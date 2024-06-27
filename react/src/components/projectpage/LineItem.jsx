//React
import { useEffect, useRef, useState } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCircleExclamation,
  faFile,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";

//Utils
import updateLineItem from "src/utils/updateLineItem";
import TextBoxHelpers from "src/components/TextBoxHelpers";
import PendingItemList from "src/components/projectpage/PendingItemList";

// Individual line item for the project grid
export default function LineItem({ lineItemData }) {
  const [loading, setLoading] = useState(false);
  const [writingNote, setWritingNote] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  //Keep track of contents of note box for the item
  const [noteState, setNoteState] = useState(lineItemData.notes || "");

  //State for the entire line for making updates
  const [lineState, setLineState] = useState({
    checkBoxes: lineItemData.checkBoxes || [0, 0, 0],
    flagMarker: lineItemData.flagMarker || false,
    notes: lineItemData.notes || "",
  });

  //Ref for input box for focus
  const noteRef = useRef(null);

  //Make request to update the line item upon a change
  useEffect(() => {
    async function putData() {
      const response = await updateLineItem(lineItemData.id, lineState);

      //Successful response, update state to reflect (should not actually change anything)
      if (response.ok) {
        setLoading(false);
        const newState = JSON.parse(response.data);

        setLineState(newState);
      } else {
        //Error response
        console.error(response.error);
        setLoading(false);
      }
    }

    //Only make api request when user made the change to state
    loading && putData();
  }, [lineState]);

  //When no longer writing note, return note to normal zindex
  useEffect(() => {
    if (!writingNote) {
      noteRef.current.classList.remove("top");
    }
  }, [writingNote]);

  function handleFlagClick() {
    setLoading(true);

    //Update state optimistically, trigger api request
    setLineState((previous) => {
      return { ...previous, flagMarker: !previous.flagMarker };
    });
  }

  function handleCheckBoxClick(event) {
    setLoading(true);

    //Cycle through the checkbox options
    const checkBoxes = [...lineState.checkBoxes];
    const index = event.currentTarget.getAttribute("index");

    checkBoxes[index] < 2 ? checkBoxes[index]++ : (checkBoxes[index] = 0);

    //Optimistic update state, trigger api request
    setLineState((previous) => {
      return { ...previous, checkBoxes: [...checkBoxes] };
    });
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

  function openNote() {
    setWritingNote(true);
    //Expand the row for visibility
    noteRef.current.parentNode.classList.add("expanded");

    //Bring note z index above any others
    noteRef.current.classList.add("top");

    //Focus the note
    noteRef.current.focus();
  }

  function closeNote() {
    //Collapse line item row, unfocus the note
    noteRef.current.parentNode.classList.remove("expanded");
    noteRef.current.blur();

    //Remove the helper tags midway thru transition so it looks nice
    setTimeout(() => {
      setWritingNote(false);
    }, 50);
  }

  //Open the note if it isnt already open
  function handleNoteClick(event) {
    event.preventDefault();
    !writingNote && openNote();
  }

  return (
    <>
      <div className="grid">
        <div
          className="cell line-item-cell centered-cell click-cell"
          onClick={handleFlagClick}
        >
          {lineState.flagMarker && (
            <span className="icon">
              <FontAwesomeIcon icon={faCircleExclamation} />
            </span>
          )}
        </div>

        <div className="cell centered-cell control-cell">
          <label className="label">{lineItemData.controlNumber}</label>
        </div>
        {lineState.checkBoxes.map((checkBox, i) => {
          return (
            <div
              key={i}
              index={i}
              className="cell line-item-cell centered-cell cell-rb click-cell"
              onClick={handleCheckBoxClick}
            >
              {Boolean(checkBox) && (
                <span className="icon">
                  <FontAwesomeIcon
                    icon={(() => {
                      switch (checkBox) {
                        case 1:
                          return faCheck;
                        case 2:
                          return faQuestion;
                      }
                    })()}
                  />
                </span>
              )}
            </div>
          );
        })}
        <div className="cell line-item-cell centered-cell cell-rb">
          <input
            className="input is-small notes-input"
            type="text"
            ref={noteRef}
            onClick={handleNoteClick}
            value={noteState}
            onChange={(e) => setNoteState(e.target.value)}
            onKeyDown={noteKeyDownHandler}
          />
          {writingNote && <TextBoxHelpers content={noteState} />}
        </div>
        <div className="cell line-item-cell centered-cell item-cell">
          <button
            className="button"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="icon-text">
              <span className="icon">
                <FontAwesomeIcon icon={faFile} />
              </span>
              <span>{lineItemData.pendingItems}</span>
            </span>
          </button>
          {menuOpen && <PendingItemList data={lineItemData} />}
        </div>
      </div>
    </>
  );
}
