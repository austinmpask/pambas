import LineItem from "src/components/projectpage/LineItem";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

export default function ProjectSection({
  checkBoxHeaders,
  sectionData,
  index,
}) {
  return (
    <div className="box mb-5 section-box">
      <div className="fixed-grid has-7-cols m-5">
        <div className="grid">
          <div className="cell is-col-span-2 header-cell header-cell-centered mb-4">
            <h2 className="title is-5">{`Section ${sectionData.sectionNumber}`}</h2>
          </div>

          {checkBoxHeaders.map((header, i) => {
            return (
              <div key={i} className="cell header-cell centered-cell mb-4">
                <label className="section-header">
                  {!index && header.toUpperCase()}
                </label>
              </div>
            );
          })}

          <div className="cell header-cell centered-cell mb-4">
            <label className="section-header">{!index && "NOTES"}</label>
          </div>
          <div className="cell header-cell mb-4 centered-cell">
            <span className="icon">
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </span>
          </div>
        </div>
        {sectionData.lineItems.map((line, index) => {
          return (
            <div
              key={index}
              className={`line-item-row${
                index === sectionData.lineItems.length - 1
                  ? " line-item-last"
                  : ""
              }`}
            >
              <LineItem lineItemData={line} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
