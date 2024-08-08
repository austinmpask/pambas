//React
import { useContext } from "react";

//Children
import CheckBoxButton from "./CheckBoxButton";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Container for the checkbox button
export default function CheckBoxCell({ i, cbState }) {
  const { lineUIState } = useContext(LineStateContext);
  return (
    <div
      key={i}
      className={`cell line-item-cell centered-cell click-cell ${
        lineUIState.complete && !lineUIState.active && " complete-cell"
      }`}
    >
      <CheckBoxButton i={i} cbState={cbState} />
    </div>
  );
}
