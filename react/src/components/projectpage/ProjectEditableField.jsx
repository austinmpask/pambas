//React
import { useState, useRef, useEffect } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePen } from "@fortawesome/free-solid-svg-icons";
import TextBoxHelpers from "../TextBoxHelpers";

//Generic field where by default the value is displayed, but if clicked it is changed to a text box which can be submitted
export default function ProjectEditableField({
  initialContent,
  objKey,
  onSubmit,
  title,
}) {
  const [editing, setEditing] = useState(false);
  const [hovering, setHovering] = useState(false);

  //Track contents of input field
  const [inputState, setInputState] = useState("");

  //Ref for focusing title input field
  const inputRef = useRef(null);

  useEffect(() => {
    //Focus the input field when editing
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  //Get rid of title editing UI
  function closeEdit() {
    setEditing(false);
    setInputState("");
  }

  //Handle ctrl + enter/ escape actions on input fields
  function handleKeys(event) {
    if (event.keyCode === 13 && event.ctrlKey) {
      //Let parent do what it wants with the data
      onSubmit(objKey, inputState);
      //Close UI
      closeEdit();
    } else if (event.keyCode === 27) {
      //Escape keypress
      closeEdit();
    }
  }

  return (
    <div
      className="edit-field"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => setEditing(true)}
    >
      {!editing && (
        <span
          className={`edit-span ${
            title ? "title is-4 has-text-weight-bold" : ""
          }`}
        >
          {initialContent}
        </span>
      )}
      {editing && (
        <>
          <div className="edit-input">
            <input
              className={`input top ${title ? "is-medium" : "is-small"}`}
              type="text"
              placeholder={initialContent}
              value={inputState}
              onChange={(e) => setInputState(e.target.value)}
              onKeyDown={handleKeys}
              ref={inputRef}
            />
            <TextBoxHelpers content={inputState} />
          </div>
        </>
      )}
      {(hovering || editing) && (
        <span className="icon">
          <FontAwesomeIcon icon={faSquarePen} />
        </span>
      )}
    </div>
  );
}
