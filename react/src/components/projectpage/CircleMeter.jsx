import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function CircleMeter({
  val,
  displayVal,
  max,
  color = "blue",
  percentage = false,
  size = 50,
}) {
  const colors = {
    red: "#FF6685",
    green: "#48C78E",
    blue: "#66D1FF",
    orange: "#FFB70F",
    turquoise: "#00D1B2",
  };

  return (
    <div style={{ width: `${size}px` }}>
      <CircularProgressbar
        value={val}
        maxValue={max}
        text={`${displayVal ? String(displayVal) : String(val)}${
          percentage ? "%" : ""
        }`}
        strokeWidth={10}
        styles={buildStyles({
          textSize: percentage ? "1.8em" : "2em",
          textColor: "#2E333D",
          pathColor: colors[color],
          trailColor: "#f0f0f0",
        })}
      />
    </div>
  );
}
