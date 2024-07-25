import { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faFloppyDisk,
  faRectangleXmark,
  faTurnDown,
} from "@fortawesome/free-solid-svg-icons";

//Popups that fall below input field to display keyboard commands for closing/saving
export default function TextBoxHelpers({ content, mini = false }) {
  const tagRef1 = useRef(null);
  const tagRef2 = useRef(null);

  //Save the initial content that was provided to tell when there is an update
  const [initialContent, _setInitialContent] = useState(content);

  //Make the tag slide into position right after it is rendered
  useEffect(() => {
    setTimeout(() => {
      tagRef2.current.classList.add("note-scoot");
    }, 1);
  }, []);

  //If the contents of the field change, drop the save tag down as well. Remove if content becomes same again
  useEffect(() => {
    if (content !== initialContent) {
      tagRef1.current.classList.add("note-scoot");
    } else {
      tagRef1.current.classList.remove("note-scoot");
    }
  }, [content]);

  return (
    <div>
      <div
        style={mini ? { left: "4px" } : {}}
        ref={tagRef1}
        className="note-helper note-tag-r"
      >
        <span className="tag has-text-white has-text-weight-semibold">
          Ctrl + Enter:&nbsp;
          <span className="icon-text">
            <span className="icon" style={{ paddingTop: "2px" }}>
              <FontAwesomeIcon icon={faFloppyDisk} />
            </span>
          </span>
        </span>
      </div>

      <div ref={tagRef2} className="note-helper note-tag-l">
        <span className="tag has-text-white has-text-weight-semibold">
          Esc:&nbsp;
          <span className="icon-text">
            <span className="icon" style={{ paddingTop: "2px" }}>
              <FontAwesomeIcon icon={faBan} />
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
