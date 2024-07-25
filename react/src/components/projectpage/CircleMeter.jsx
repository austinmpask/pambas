import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function CircleMeter({
  val,
  displayVal,
  max,
  color = "blue",
  fill = "#f0f0f0",
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
        text={`${displayVal ? displayVal : val}${percentage ? "%" : ""}`}
        strokeWidth={10}
        styles={buildStyles({
          textSize: percentage ? "1.8em" : "2em",
          textColor: fill === "white" ? "#ffffff" : "#2E333D",
          pathColor: colors[color],
          trailColor: fill,
        })}
      />
    </div>
  );
}
