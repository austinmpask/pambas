//React
import { useContext, useState, useEffect } from "react";

//Children
import CheckBoxButton from "./CheckBoxButton";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

import { Colors } from "src/utils/validations";

//Container for the checkbox button
export default function CheckBoxCell({ i, cbState }) {
  const { lineUIState } = useContext(LineStateContext);

  //Map cbState to colors
  const backgroundColor = ["#ffffff", Colors.success, Colors.warn];
  const shadowColor = [
    Colors.lightShadow,
    Colors.successShadow,
    Colors.warnShadow,
  ];

  //Button styles

  const styles = {
    idle: {
      boxShadow: "none",
      marginTop: 0,
      position: "relative",
      zIndex: 0,
      bottom: 0,
      height: "100%",
      color: "#000000",
    },
    hover: {
      marginTop: 0,
      paddingTop: 0,
      position: "relative",
      zIndex: 0,
      height: "107%",
      bottom: "7%",
      border: "1px solid ",
      boxShadow: "0px 3px 10px 0px rgba(0,0,0,0.3), inset 0 -6px 0 ",
    },
    clicked: {
      marginTop: 0,
      paddingTop: 10,
      position: "relative",
      zIndex: 0,
      height: "100%",
      bottom: "0%",
      boxShadow: "0px 0px 0px 0px rgba(0,0,0,0), inset 0 10px 10px ",
    },
  };

  const [buttonStyle, setButtonStyle] = useState(styles.idle);

  return (
    <div
      onMouseDown={() => setButtonStyle(styles.clicked)}
      onMouseUp={() => setButtonStyle(styles.hover)}
      onMouseEnter={() => setButtonStyle(styles.hover)}
      onMouseLeave={() => setButtonStyle(styles.idle)}
      key={i}
      className={` flex flex-col items-center justify-center ${
        lineUIState.complete && !lineUIState.active && "TODOcomplete-cell"
      }`}
    >
      <CheckBoxButton
        buttonStyle={{
          ...buttonStyle,
          backgroundColor: backgroundColor[cbState],
          color: shadowColor[cbState],
          border: buttonStyle.border
            ? buttonStyle.border + shadowColor[cbState]
            : "none",
          boxShadow:
            buttonStyle.boxShadow === "none"
              ? buttonStyle.boxShadow
              : buttonStyle.boxShadow + shadowColor[cbState],
        }}
        i={i}
        cbState={cbState}
      />
    </div>
  );
}
