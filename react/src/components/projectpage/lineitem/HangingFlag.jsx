//React
import { useContext, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

//Utils
import { UIVars } from "src/utils/validations";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Hanging flag marker to indicate a line item as important
export default function HangingFlag() {
  const { lineState } = useContext(LineStateContext);

  const [visible, setVisible] = useState(false);
  const [scoot, setScoot] = useState(false);

  useEffect(() => {
    lineState.flagMarker ? setVisible(true) : setScoot(false);
  }, [lineState.flagMarker]);

  useEffect(() => {
    visible &&
      !scoot &&
      setTimeout(() => {
        setScoot(true);
      }, 1);
  }, [visible]);

  useEffect(() => {
    !scoot &&
      visible &&
      setTimeout(() => {
        setVisible(false);
      }, 200);
  }, [scoot]);
  return (
    <div
      className={`${visible ? "flex" : "hidden"} ${
        scoot
          ? "ease-fmarker-in translate-x-0"
          : "ease-fmarker-out translate-x-[70px]"
      } flex-col items-center justify-center pr-[30px] h-[58px] w-[75px] transition-all duration-200  absolute left-[-40px] translate-y-[1px] rounded-xl bg-danger text-white -z-10`}
    >
      <span className="icon fu-icon">
        <FontAwesomeIcon icon={faCircleExclamation} />
      </span>
    </div>
  );
}
