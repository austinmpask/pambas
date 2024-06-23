//React
import { useEffect, useState } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCircleExclamation,
  faFile,
} from "@fortawesome/free-solid-svg-icons";

//Utils
import updateLineItem from "src/utils/updateLineItem";

export default function LineItem({ lineItemData }) {
  const [loading, setLoading] = useState(false);

  const [lineState, setLineState] = useState({
    checkBoxes: lineItemData.checkBoxes || [0, 0, 0],
    flagMarker: lineItemData.flagMarker || false,
    notes: lineItemData.notes || "",
  });

  useEffect(() => {
    async function putData() {
      const response = await updateLineItem(lineItemData.id, lineState);

      if (!response.ok) {
        console.error(response.error);
      }
      setLoading(false);
    }

    loading && putData();
  }, [lineState]);

  function handleFlagClick(event) {
    event.preventDefault();
    setLoading(true);
    setLineState((previous) => {
      return { ...previous, flagMarker: !previous.flagMarker };
    });
  }

  return (
    <>
      <div className="grid">
        <div
          className="cell line-item-cell centered-cell flag-cell"
          onClick={handleFlagClick}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faCircleExclamation} />
          </span>
        </div>

        <div className="cell centered-cell control-cell">
          <label className="label">{lineItemData.controlNumber}</label>
        </div>
        {lineItemData.checkBoxes.map((checkBox, i) => {
          return (
            <div key={i} className="cell line-item-cell centered-cell cell-rb">
              <span className="icon">
                <FontAwesomeIcon icon={faCheck} />
              </span>
            </div>
          );
        })}
        <div className="cell line-item-cell centered-cell cell-rb">
          <input className="input is-small notes-input" type="text" />
        </div>
        <div className="cell line-item-cell centered-cell">
          <span className="icon">
            <FontAwesomeIcon icon={faFile} />
          </span>
        </div>
      </div>
    </>
  );
}
