import { AwesomeButton } from "react-awesome-button";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faQuestion } from "@fortawesome/free-solid-svg-icons";
import "react-awesome-button/dist/styles.css";

export default function CheckBoxButton({
  index,
  cbState,
  setLineState,
  setLoading,
  active,
}) {
  //Click checkbox: cycle thru 0-2, update state optimistically, trigger api request
  function handleCheckBoxClick() {
    setLoading(true);

    //Cycle through the checkbox options
    //Checkbox can be 0, 1, 2
    const newVal = cbState < 2 ? cbState + 1 : 0;

    //Optimistic update state, trigger api request
    setLineState((prev) => {
      const cb = [...prev.checkBoxes];
      cb[index] = newVal;
      return { ...prev, checkBoxes: [...cb] };
    });
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
    if (active) {
      requestAnimationFrame(() => togButton(true));
    } else {
      requestAnimationFrame(() => togButton(false));
    }
  }, [active]);

  return (
    <div onClick={handleCheckBoxClick} className="cb-container">
      <AwesomeButton
        style={{
          "--button-raise-level": `${raiseLevel}px`,
        }}
        className={`${active && "raise"} ${cbState === 1 && " check"} ${
          cbState === 2 && " question"
        } ${active && cbState === 1 && " check-raise"} ${
          active && cbState === 2 && " question-raise"
        }`}
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
                    return faQuestion;
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
