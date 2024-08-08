//React
import { useContext } from "react";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Cell to display the control number, or indicate the flag status when it is raised
export default function ControlNumberCell({ handleClick }) {
  const { lineState, lineUIState } = useContext(LineStateContext);
  return (
    <div
      className={`cell centered-cell control-cell ${
        lineUIState.active && " click-cell control-cell-active"
      } ${
        lineUIState.active && lineState.flagMarker && " control-cell-danger"
      } ${lineUIState.complete && !lineUIState.active && " complete-cell"} `}
      onClick={handleClick}
    >
      <label
        className={`label ${
          lineState.flagMarker && lineUIState.active
            ? "has-text-white"
            : "has-text-grey"
        } ${lineUIState.active && "click-cell z1"} `}
      >
        {lineState.controlNumber}
      </label>
    </div>
  );
}
