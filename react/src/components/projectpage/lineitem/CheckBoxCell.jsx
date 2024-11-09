/*-------------------Cleaned up 9/10/24-------------------*/
//React
import { useState } from "react";

//Children
import CheckBoxButton from "./CheckBoxButton";

//Utils
import { Colors } from "src/utils/validations";

//Container cell for the checkbox button. Handles styling based on mouse events w/ cell
export default function CheckBoxCell({ i, cbState }) {
  //Map button color and shadow to cbState value (0,1,2)
  const backgroundColor = [Colors.lightBg, Colors.success, Colors.warn];
  const shadowColor = [
    Colors.lightShadow,
    Colors.successShadow,
    Colors.warnShadow,
  ];

  //Button CSS styles for hovering, idle and clicking
  const styles = {
    idle: {
      border: "none",
      paddingTop: "0px",
      // transitionTimingFunction: "cubic-bezier(.39,.86,.34,1)",
    },
    hover: {
      border: "1px solid ",
      paddingTop: "0px",
      backgroundColor: "#F4F4F5",
      // transitionTimingFunction: "cubic-bezier(0,0,0,0)",
      // boxShadow: "0px 3px 10px 0px rgba(0,0,0,0.3), inset 0 -6px 0 ",
    },
    clicked: {
      border: "1px solid ",
      paddingTop: "15px",
      // boxShadow: "0px 0px 0px 0px rgba(0,0,0,0), inset 0 10px 10px ",
    },
  };

  //Persist button CSS Styles
  const [buttonStyle, setButtonStyle] = useState(styles.idle);

  return (
    <div
      // Assign CSS Styling to button based on mouse actions in the cell
      onMouseDown={() => setButtonStyle(styles.clicked)}
      onMouseUp={() => setButtonStyle(styles.hover)}
      onMouseEnter={() => setButtonStyle(styles.hover)}
      onMouseLeave={() => setButtonStyle(styles.idle)}
      key={i}
      className="flex flex-col items-center justify-center"
    >
      <CheckBoxButton
        // Combine CSS Styling from mouse interactions + cbState
        buttonStyle={{
          ...buttonStyle,
          backgroundColor: cbState
            ? backgroundColor[cbState]
            : buttonStyle.backgroundColor,
          color: shadowColor[cbState],
          border: buttonStyle.border
            ? buttonStyle.border + `${shadowColor[cbState]}80`
            : "none",
        }}
        i={i}
        cbState={cbState}
      />
    </div>
  );
}
