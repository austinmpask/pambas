import { useEffect, useState } from "react";
import CircleMeter from "./CircleMeter";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";

//Two types: "bill", and "modal". Bill will open the bill interface within the component, modal will open a list of pending items
export default function MeterButton({
  val,
  displayVal,
  max,
  color,
  percentage = false,
  label,
  type = "bill",
  objKey,
  onSubmit,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [amountToBill, setAmountToBill] = useState(0);

  //Reset the input when menu opens/closes
  useEffect(() => {
    setAmountToBill(0);
  }, [menuOpen]);

  function billClient() {
    //Make request if there was an amount entered
    if (amountToBill !== 0) onSubmit(objKey, amountToBill);
    setMenuOpen(false);
  }

  return (
    <div
      className={`box header-button ${menuOpen && "header-button-menu-open"}`}
    >
      <div
        className="header-button-section click-cell"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
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
      <CSSTransition
        in={menuOpen}
        unmountOnExit
        classNames={"bill-interface"}
        timeout={250}
      >
        <div className="header-button-section">
          <div className="bill-form">
            <input
              className="input bill-input"
              type="number"
              value={amountToBill}
              onChange={(e) => setAmountToBill(e.target.value)}
            ></input>

            <button
              className="button bill-button"
              onClick={() => setAmountToBill((prev) => prev - 1)}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faMinus} />
              </span>
            </button>
            <button
              className="button bill-button is-dark"
              onClick={() => setAmountToBill((prev) => prev + 1)}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faPlus} />
              </span>
            </button>
          </div>

          <button
            className="button is-success has-text-white"
            onClick={billClient}
          >
            Bill it!
          </button>
        </div>
      </CSSTransition>
    </div>
  );
}
