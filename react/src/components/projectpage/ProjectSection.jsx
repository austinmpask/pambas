import LineItem from "src/components/projectpage/LineItem";

export default function ProjectSection({ checkBoxHeaders, sectionData }) {
  return (
    <div className="box mb-5">
      <div className="fixed-grid has-7-cols">
        <div className="grid">
          <div className="cell is-col-span-2 header-cell header-cell-centered mb-4">
            <h2 className="title is-5">{`Section ${sectionData.sectionNumber}`}</h2>
          </div>

          {checkBoxHeaders.map((header) => {
            return (
              <div className="cell header-cell centered-cell mb-4">
                <label className="section-header">{header}</label>
              </div>
            );
          })}

          <div className="cell header-cell centered-cell mb-4">
            <label className="section-header">Notes</label>
          </div>
          <div className="cell header-cell mb-4"></div>
        </div>
        {sectionData.lineItems.map((line, index) => {
          return (
            <div
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
