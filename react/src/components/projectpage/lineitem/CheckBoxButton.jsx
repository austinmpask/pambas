/*-------------------Cleaned up 9/10/24-------------------*/
//React
import { useContext } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faRotateLeft } from "@fortawesome/free-solid-svg-icons";

//Contexts
import { LineStateContext } from "./LineItemWrapper";

//2d/3d hybrid button for checkboxes
export default function CheckBoxButton({ buttonStyle, i, cbState }) {
  //Access unique line context
  const { setLineState, setLoading } = useContext(LineStateContext);

  //Click checkbox: Cycle thru 0-2, update state optimistically, trigger api request
  function handleCheckBoxClick() {
    setLoading(true);
    //Cycle through the checkbox options
    //Checkbox can be 0, 1, 2
    const newVal = cbState < 2 ? cbState + 1 : 0;

    //Optimistic update state, which triggers api request
    setLineState((prev) => {
      //Assign val to correct box only
      const cb = [...prev.checkBoxes];
      cb[i] = newVal;
      return { ...prev, checkBoxes: [...cb] };
    });
  }

  return (
    <div
      className="relative button-transition w-full h-full flex items-center justify-center cursor-pointer"
      onClick={handleCheckBoxClick}
      style={buttonStyle} //CSS Styles to apply to button based on if hovering/idle/clicked. Controlled by parent
    >
      {
        // Display an icon for vals 1/2 or just " " if 0.
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
    </div>
  );
}
