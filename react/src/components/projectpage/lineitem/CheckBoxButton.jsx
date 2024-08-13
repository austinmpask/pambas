//React
import { useContext, useEffect, useRef, useState } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faRotateLeft } from "@fortawesome/free-solid-svg-icons";

//Children
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//Utils
import { UIVars } from "src/utils/validations";

//2d/3d hybrid button for checkboxes
export default function CheckBoxButton({ i, cbState }) {
  //Access unique line context
  const { lineState, lineUIState, setLineState, setLoading } =
    useContext(LineStateContext);

  //Ref for changing style for .aws-btn__content to handle 2d/3d corner effects
  const styleRef = useRef(null);

  //Create a css class specific to this line item
  const indexedClass = `container-${lineState.controlNumber
    .split(".")
    .join("")}`;

  //Click checkbox: Cycle thru 0-2, update state optimistically, trigger api request
  function handleCheckBoxClick() {
    //Only works if the line is activated
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

  //ANIMATE 2D/3D TRANSITION

  //Raise level is the button height, i.e. 0 = 2d button
  const [raiseLevel, setRaiseLevel] = useState(0);

  //Initiate 3d transition when line activated
  useEffect(() => {
    //Record animation START TIME
    const begin = performance.now();

    function togButton(up) {
      //Record CURRENT TIME
      const now = performance.now();

      //Delta time calc
      const elapsedTime = now - begin;

      //Calculte percentage of max height based on delta time. Max out at 100%
      const progress = Math.min(elapsedTime / UIVars.BUTTON_RAISE_ANIM_MS, 1);

      //Calculate height based on progress
      const currentLevel = UIVars.BUTTON_RAISE_HEIGHT_PX * progress;

      //Set the button height, invert it for animating back to 2d (!up)
      setRaiseLevel(
        up ? currentLevel : UIVars.BUTTON_RAISE_HEIGHT_PX - currentLevel
      );

      //Reiterate until timeout
      if (progress < 1) {
        requestAnimationFrame(() => togButton(up));
      }
    }

    //If active, toggle the button UP, if inactive, toggle the button DOWN
    if (lineUIState.active) {
      requestAnimationFrame(() => togButton(true));
    } else {
      requestAnimationFrame(() => togButton(false));
    }
  }, [lineUIState.active]);

  //Change corner radius for .aws-btn__content upon activation for the current line ONLY
  useEffect(() => {
    //Attach style to document head
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      document.head.appendChild(styleRef.current);
    }

    //Select .aws-btn__content based on the unique identifier for the current line item
    //Workaround since applying to the button component or the available configurations does not work as intended for this
    //Add appropriate styles based on 'active'
    styleRef.current.innerHTML = `
    .${indexedClass} .aws-btn__content {
      border-top-left-radius: ${
        lineUIState.active ? `${UIVars.BUTTON_RAISE_RADIUS_TOP_PX}px` : "0px"
      } !important;
      border-top-right-radius: ${
        lineUIState.active ? `${UIVars.BUTTON_RAISE_RADIUS_TOP_PX}px` : "0px"
      } !important;
      border-bottom-left-radius: ${
        lineUIState.active ? `${UIVars.BUTTON_RAISE_RADIUS_BOTTOM_PX}px` : "0px"
      } !important;
      border-bottom-right-radius: ${
        lineUIState.active ? `${UIVars.BUTTON_RAISE_RADIUS_BOTTOM_PX}px` : "0px"
      } !important;
      transition: all ${UIVars.BUTTON_BORDER_TRANSITION_MS}ms;
    }
  `;

    //Cleanup
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
      // Apply unique class for line item
      className={`cb-container ${indexedClass}`}
      //Raise button above other components if line is in use
      style={
        lineUIState.up
          ? { zIndex: UIVars.BUTTON_ACTIVE_ZINDEX }
          : { zIndex: UIVars.BUTTON_INACTIVE_ZINDEX }
      }
    >
      <AwesomeButton
        //Reflect animated raise level in the button component
        style={{
          "--button-raise-level": `${raiseLevel}px`,
        }}
        //When active, apply new styles depending on the contents
        className={`${lineUIState.active && "raise"} ${
          cbState === 1 && " check"
        } ${cbState === 2 && " question"} ${
          lineUIState.active && cbState === 1 && " check-raise"
        } ${lineUIState.active && cbState === 2 && " question-raise"}`}
        type="primary"
      >
        {/* Change the displayed icon depending on cbState */}
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
