//React
import { useContext, useEffect, useState } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faRotateLeft } from "@fortawesome/free-solid-svg-icons";

import ReactiveButton from "reactive-button";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Utils
import { UIVars } from "src/utils/validations";

//2d/3d hybrid button for checkboxes
export default function CheckBoxButton({ buttonStyle, i, cbState }) {
  //Access unique line context
  const { lineState, lineUIState, setLineState, setLoading } =
    useContext(LineStateContext);

  //Click checkbox: Cycle thru 0-2, update state optimistically, trigger api request
  function handleCheckBoxClick() {
    //Only works if the line is activated

    setLoading(true);
    //Cycle through the checkbox options
    //Checkbox can be 0, 1, 2
    const newVal = cbState < 2 ? cbState + 1 : 0;

    //Optimistic update state, trigger api request
    setLineState((prev) => {
      const cb = [...prev.checkBoxes];
      cb[i] = newVal;
      return { ...prev, checkBoxes: [...cb] };
    });
  }

  return (
    <ReactiveButton
      width="100%"
      height="100%"
      onClick={handleCheckBoxClick}
      style={buttonStyle}
      idleText={
        cbState ? (
          <FontAwesomeIcon
            icon={(() => {
              switch (cbState) {
                case 1:
                  return faCheck;
                case 2:
                  return faRotateLeft;
              }
            })()}
          />
        ) : (
          " "
        )
      }
    />
  );
}
