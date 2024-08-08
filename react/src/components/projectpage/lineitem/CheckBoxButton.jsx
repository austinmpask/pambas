import { AwesomeButton } from "react-awesome-button";
import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import "react-awesome-button/dist/styles.css";
import { LineStateContext } from "./LineItemWrapper";

export default function CheckBoxButton({ i, cbState }) {
  const { lineState, lineUIState, setLineState, setLoading } =
    useContext(LineStateContext);
  const styleRef = useRef(null);
  const indexedClass = `container-${lineState.controlNumber
    .split(".")
    .join("")}`;

  // const indexedClass = `container-${lineState.controlNumber}`;
  //Click checkbox: cycle thru 0-2, update state optimistically, trigger api request
  function handleCheckBoxClick() {
    if (lineUIState.active) {
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
  }

  const [raiseLevel, setRaiseLevel] = useState(0);
  const buttonRaisedHeight = 5;
  const durationMS = 150;

  useEffect(() => {
    const begin = performance.now();

    function togButton(up) {
      const now = performance.now();
      const elapsedTime = now - begin;

      const progress = Math.min(elapsedTime / durationMS, 1);
      const currentLevel = buttonRaisedHeight * progress;
      setRaiseLevel(up ? currentLevel : buttonRaisedHeight - currentLevel);

      if (progress < 1) {
        requestAnimationFrame(() => togButton(up));
      }
    }
    if (lineUIState.active) {
      requestAnimationFrame(() => togButton(true));
    } else {
      requestAnimationFrame(() => togButton(false));
    }
  }, [lineUIState.active]);

  //Button shape change
  useEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      document.head.appendChild(styleRef.current);
    }

    styleRef.current.innerHTML = `
    .${indexedClass} .aws-btn__content {
      border-top-left-radius: ${lineUIState.active ? "6px" : "0px"} !important;
      border-top-right-radius: ${lineUIState.active ? "6px" : "0px"} !important;
      border-bottom-left-radius: ${
        lineUIState.active ? "8px" : "0px"
      } !important;
      border-bottom-right-radius: ${
        lineUIState.active ? "8px" : "0px"
      } !important;
      transition: all 150ms;
    }
  `;

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, [lineUIState.active]);

  return (
    <div
      onClick={handleCheckBoxClick}
      className={`cb-container ${indexedClass}`}
      style={lineUIState.up ? { zIndex: "20" } : { zIndex: "0" }}
    >
      <AwesomeButton
        style={{
          "--button-raise-level": `${raiseLevel}px`,
        }}
        className={`${lineUIState.active && "raise"} ${
          cbState === 1 && " check"
        } ${cbState === 2 && " question"} ${
          lineUIState.active && cbState === 1 && " check-raise"
        } ${lineUIState.active && cbState === 2 && " question-raise"}`}
        type="primary"
      >
        {(Boolean(cbState) && (
          <span className="icon">
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
          </span>
        )) ||
          " "}
      </AwesomeButton>
    </div>
  );
}
