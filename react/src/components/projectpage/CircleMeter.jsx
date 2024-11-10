/*-------------------Cleaned up 9/17/24-------------------*/

//Children
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

//Utils
import { Colors } from "src/utils/validations";

//Circular progress meter component, uses several color options
export default function CircleMeter({
  val,
  displayVal,
  max,
  color = "primary",
  fill = "#f0f0f0",
  percentage = false,
  size = 50,
}) {
  return (
    <div style={{ width: `${size}px` }}>
      <CircularProgressbar
        value={val}
        maxValue={max}
        text={`${displayVal ? displayVal : val}${percentage ? "%" : ""}`}
        strokeWidth={10}
        styles={buildStyles({
          textSize: percentage ? "1.8em" : "2em",
          textColor: fill === "white" ? "#ffffff" : "#71717A",
          pathColor: Colors[color],
          trailColor: fill,
        })}
      />
    </div>
  );
}
