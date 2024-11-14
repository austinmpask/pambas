/*-------------------Cleaned up 9/12/24-------------------*/
//React
import { useContext, useState, useEffect } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Hanging flag marker to indicate a line item as important. Pops out from left of the control number cell
export default function HangingFlag({ close, setClose }) {
  //Consume linestate context

  const [scoot, setScoot] = useState(false);

  const { setLineState } = useContext(LineStateContext);

  // After rendered, scoot it out from behind the line
  useEffect(() => {
    setTimeout(() => {
      setScoot(true);
    }, 1);
  }, []);

  // If told to close, scoot back behind the line, and then toggle the flag marker and close back to false
  useEffect(() => {
    if (close) {
      setScoot(false);
      setTimeout(() => {
        setLineState((prev) => ({
          ...prev,
          flagMarker: false,
        }));
        setClose(false);
      }, 200);
    }
  }, [close]);

  return (
    <div
      className={
        // Handle animation
        `flex ${
          scoot
            ? "ease-fmarker-in translate-x-0"
            : "ease-fmarker-out translate-x-[70px]"
        } flex-col items-center justify-center pr-[30px] h-[58px] w-[75px] transition-all duration-200  absolute left-[-40px] translate-y-[1px] rounded-xl bg-danger text-white -z-10`
      }
    >
      {/* Displays a ! icon */}

      <FontAwesomeIcon icon={faCircleExclamation} />
    </div>
  );
}
