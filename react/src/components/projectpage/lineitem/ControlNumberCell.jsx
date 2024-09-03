//React
import { useContext } from "react";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Cell to display the control number, or indicate the flag status when it is raised
export default function ControlNumberCell({ handleClick }) {
  const { lineState, lineUIState } = useContext(LineStateContext);
  return (
    <div
      className={`transition-all border-solid border-r-1 border-inherit flex flex-col justify-center items-center cursor-pointer ${
        lineUIState.complete && "bg-success border-success overflow"
      }`}
      onClick={handleClick}
    >
      <p className="text-small font-semibold text-default-500">
        {lineState.controlNumber}
      </p>
    </div>
  );
}
