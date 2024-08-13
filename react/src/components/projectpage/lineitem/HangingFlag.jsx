//React
import { useContext } from "react";
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
  const { lineUIState } = useContext(LineStateContext);
  return (
    <CSSTransition
      in={lineUIState.hangingFlag}
      unmountOnExit
      classNames={"fu-marker"}
      timeout={UIVars.HANGING_FLAG_ANIM_MS}
    >
      <div className="fu-marker has-background-danger has-text-white" s>
        <span className="icon fu-icon">
          <FontAwesomeIcon icon={faCircleExclamation} />
        </span>
      </div>
    </CSSTransition>
  );
}
