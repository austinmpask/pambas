import CircleMeter from "./CircleMeter";

export default function MeterButton({
  val,
  displayVal,
  max,
  color,
  percentage = false,
  label,
}) {
  return (
    <div className="box header-button">
      <div className="mr-4">
        <CircleMeter
          val={val}
          displayVal={displayVal}
          max={max}
          percentage={percentage}
          color={color}
        />
      </div>
      <h3 className="title is-6 has-text-weight-semibold">{label}</h3>
    </div>
  );
}
