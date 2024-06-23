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

export default function LineItem({ lineItemData }) {
  const [loading, setLoading] = useState(false);
  const [writingNote, setWritingNote] = useState(false);

  const [noteState, setNoteState] = useState(lineItemData.notes || "");

  const [lineState, setLineState] = useState({
    checkBoxes: lineItemData.checkBoxes || [0, 0, 0],
    flagMarker: lineItemData.flagMarker || false,
    notes: lineItemData.notes || "",
  });

  const noteRef = useRef(null);
  const tagRef1 = useRef(null);
  const tagRef2 = useRef(null);

  useEffect(() => {
    async function putData() {
      const response = await updateLineItem(lineItemData.id, lineState);

      if (response.ok) {
        setLoading(false);
        const newState = JSON.parse(response.data);

        setLineState(newState);
      } else {
        console.error(response.error);
        setLoading(false);
      }
    }

    loading && putData();
  }, [lineState]);

  useEffect(() => {
    if (writingNote) {
      tagRef1.current.style.display = "block";
      tagRef1.current.classList.add("note-scoot");
    }
  }, [noteState]);

  useEffect(() => {
    if (writingNote) {
      setTimeout(() => {
        tagRef2.current.style.display = "block";
        tagRef2.current.classList.add("note-scoot");
      }, 1);
    }
  }, [writingNote]);

  function handleFlagClick(event) {
    event.preventDefault();
    setLoading(true);

    //Optimistic state
    setLineState((previous) => {
      return { ...previous, flagMarker: !previous.flagMarker };
    });
  }

  function handleCheckBoxClick(event) {
    event.preventDefault();
    setLoading(true);

    const checkBoxes = [...lineState.checkBoxes];
    const index = event.currentTarget.getAttribute("index");

    checkBoxes[index] < 2 ? checkBoxes[index]++ : (checkBoxes[index] = 0);

    //Optimistic state
    setLineState((previous) => {
      return { ...previous, checkBoxes: [...checkBoxes] };
    });
  }

  function noteKeyDownHandler(event) {
    if (event.keyCode === 13 && event.ctrlKey) {
      setLoading(true);
      setLineState((previous) => {
        return { ...previous, notes: noteState };
      });
      closeNote(event);
    } else if (event.keyCode === 27) {
      setNoteState(lineState.notes);
      closeNote(event);
    }
  }

  function openNote() {
    setWritingNote(true);
    noteRef.current.parentNode.classList.add("expanded");
    noteRef.current.classList.add("top");
    noteRef.current.focus();
  }

  function closeNote() {
    noteRef.current.parentNode.classList.remove("expanded");
    noteRef.current.blur();
    setTimeout(() => {
      setWritingNote(false);
      tagRef1.current.style.display = "none";
      tagRef2.current.style.display = "none";
      noteRef.current.classList.remove("top");
    }, 50);
    tagRef1.current.classList.remove("note-scoot");
    tagRef2.current.classList.remove("note-scoot");
  }

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
          {writingNote && (
            <div>
              <div
                ref={tagRef1}
                className="has-background-dark note-helper note-tag-r"
              >
                <span className="tag">CTRL + Enter: Save</span>
              </div>

              <div
                ref={tagRef2}
                className="has-background-dark note-helper note-tag-l"
              >
                <span className="tag">ESC: Close</span>
              </div>
            </div>
          )}
        </div>
        <div className="cell line-item-cell centered-cell">
          <span className="icon">
            <FontAwesomeIcon icon={faFile} />
          </span>
        </div>
      </div>
    </>
  );
}
