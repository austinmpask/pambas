import { useEffect, useRef, useState, useContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faFloppyDisk,
  faRectangleXmark,
  faTurnDown,
} from "@fortawesome/free-solid-svg-icons";

import { Chip, Kbd } from "@nextui-org/react";

import { LineStateContext } from "src/components/projectpage/lineitem/LineItemWrapper";

//Popups that fall below input field to display keyboard commands for closing/saving
export default function TextBoxHelpers({ content, mini = false }) {
  const { lineUIState } = useContext(LineStateContext);
  //Save the initial content that was provided to tell when there is an update
  const [initialContent, _setInitialContent] = useState(content);

  const hidden = "-translate-y-10";
  const show = " ";

  const [leftY, setLeftY] = useState(false);
  const [rightY, setRightY] = useState(false);

  // Make the tag slide into position right after it is rendered
  useEffect(() => {
    setTimeout(() => {
      setLeftY(true);
    }, 100);
  }, []);

  useEffect(() => {
    if (!lineUIState.writingNote) {
      setLeftY(false);
      setRightY(false);
      console.log("hi");
    }
  }, [lineUIState.writingNote]);

  // If the contents of the field change, drop the save tag down as well. Remove if content becomes same again
  useEffect(() => {
    if (content !== initialContent) {
      setRightY(true);
    } else {
      setRightY(false);
      // setLeftY(false);
    }
  }, [content]);

  return (
    <div className="relative z-10 top-[-6px]">
      <div
        className={`absolute right-2 transition-all ease-out duration-150 ${
          rightY ? show : hidden
        }`}
      >
        <Chip radius="sm" className="rounded-t-none bg-green-500">
          <Kbd
            className="bg-transparent shadow-none p-0 text-white"
            keys={["command", "enter"]}
          />
          <span className="text-xs font-semibold text-white"> Save</span>
        </Chip>
      </div>

      <div
        className={`absolute left-2 transition-all ease-out duration-150 ${
          leftY ? show : hidden
        }`}
      >
        <Chip radius="sm" className="rounded-t-none bg-red-500">
          <Kbd
            className="bg-transparent shadow-none p-0 text-white"
            keys={["escape"]}
          />
          <span className="text-xs font-semibold text-white"> Discard</span>
        </Chip>
      </div>
    </div>
  );
}
