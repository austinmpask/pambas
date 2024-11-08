/*-------------------Cleaned up 11/8/24-------------------*/

//React
import { useEffect, useState, useContext } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faRectangleXmark,
} from "@fortawesome/free-solid-svg-icons";

//Children
import { Chip } from "@nextui-org/react";

//Contexts
import { LineStateContext } from "src/components/projectpage/lineitem/LineItemWrapper";

//Popups that fall below input field to display keyboard commands for closing/saving and react to field contents
export default function TextBoxHelpers({ content }) {
  const { lineUIState } = useContext(LineStateContext);
  //Save the initial content that was provided to tell when there is an update
  const [initialContent, _setInitialContent] = useState(content);

  //CSS template for "hiding"
  const hidden = "-translate-y-10 opacity-0";

  //States for position of the helpers
  const [leftY, setLeftY] = useState(false);
  const [rightY, setRightY] = useState(false);

  // Make the tag slide into position right after it is rendered
  useEffect(() => {
    setTimeout(() => {
      setLeftY(true);
    }, 1);
  }, []);

  //On note closure, hide the helpers
  useEffect(() => {
    if (!lineUIState.writingNote) {
      setLeftY(false);
      setRightY(false);
    }
  }, [lineUIState.writingNote]);

  // If the contents of the field change, drop the save tag down  as well. Remove if content becomes same again
  useEffect(() => {
    if (content !== initialContent) {
      setRightY(true);
    } else {
      setRightY(false);
    }
  }, [content]);

  return (
    <div className="relative z-10 top-[-6px]">
      <div
        className={`absolute right-2 transition-all ease-out duration-150 ${
          rightY ? "" : hidden //Translate to hide
        }`}
      >
        <Chip radius="sm" className="rounded-t-none bg-green-500">
          <FontAwesomeIcon className="mr-2 text-white" icon={faFloppyDisk} />
          <span className="text-xs font-semibold text-white">Enter</span>
        </Chip>
      </div>

      <div
        className={`absolute left-2 transition-all ease-out duration-150 ${
          leftY ? "" : hidden //Translate to hide
        }`}
      >
        <Chip radius="sm" className="rounded-t-none bg-red-500">
          <FontAwesomeIcon
            className="mr-2 text-white"
            icon={faRectangleXmark}
          />
          <span className="text-xs font-semibold text-white">Esc</span>
        </Chip>
      </div>
    </div>
  );
}
