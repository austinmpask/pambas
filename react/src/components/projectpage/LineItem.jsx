import {
  faCheck,
  faCircleExclamation,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LineItem({ lineItemData }) {
  return (
    <div className="grid">
      <div className="cell line-item-cell centered-cell">
        <span className="icon">
          <FontAwesomeIcon icon={faCircleExclamation} />
        </span>
      </div>

      <div className="cell centered-cell control-cell">
        <label className="label">{lineItemData.controlNumber}</label>
      </div>
      {lineItemData.checkBoxes.map((checkBox) => {
        return (
          <div className="cell line-item-cell centered-cell cell-rb">
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
  );
}
