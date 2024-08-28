//React
import { useContext } from "react";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Cell to display the control number, or indicate the flag status when it is raised
export default function ControlNumberCell({ handleClick }) {
  const { lineState, lineUIState } = useContext(LineStateContext);
  return (
    <div
      className={`border-solid border-r-1 border-inherit flex flex-col justify-center items-center ${
        lineUIState.active && " TODOclick-cell,control-cell-active"
      } ${
        lineUIState.active && lineState.flagMarker && "TODOcontrol-cell-danger"
      } ${lineUIState.complete && !lineUIState.active && "TODOcomplete-cell"} `}
      onClick={handleClick}
    >
      <p
        className={`text-small font-semibold text-default-500 ${
          lineState.flagMarker && lineUIState.active
            ? "TODOhas-text-white"
            : "TODOhas-text-grey"
        } ${lineUIState.active && "TODOclick-cell,z1"} `}
      >
        {lineState.controlNumber}
      </p>
    </div>
  );
}
