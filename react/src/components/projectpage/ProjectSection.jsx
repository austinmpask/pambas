//React
import { useContext } from "react";

//Contexts
import { ProjectUpdaterContext } from "src/pages/ProjectPage";

//Children
import LineItem from "src/components/projectpage/LineItem";
import ProjectEditableField from "src/components/projectpage/ProjectEditableField";

//Individual section within the project grid
export default function ProjectSection({
  contextSlice,
  sectionData,
  setHeaderStats,
  index,
}) {
  const updateProjectSummaryContext = useContext(ProjectUpdaterContext);
  //Apply a change to whatever index of the header array the user edited, then update context with that
  function updateHeaders(i, value) {
    const newHeaders = [...contextSlice.checkBoxHeaders];
    newHeaders[i] = value;

    //Update the object k/v in the project summary context list
    updateProjectSummaryContext("checkBoxHeaders", newHeaders);
  }

  return (
    <div className="card mt-6 section-card">
      <div className="card-header sec-header">
        <h2 className="title is-4 has-text-weight-bold m-4">{`Section ${sectionData.sectionNumber}`}</h2>
      </div>
      <div className="fixed-grid has-6-cols m-2 mt-3">
        <div className="grid">
          {!index && (
            <>
              <div className="cell header-cell header-cell-centered mb-2" />
              {contextSlice.checkBoxHeaders.map((header, i) => {
                return (
                  <div key={i} className="cell header-cell centered-cell">
                    {!index && (
                      <ProjectEditableField
                        initialContent={header.toUpperCase()}
                        objKey={i}
                        onSubmit={updateHeaders}
                      />
                    )}
                  </div>
                );
              })}
              <div className="cell header-cell centered-cell">
                <label className="section-header">NOTES</label>
              </div>
            </>
          )}
        </div>
        {sectionData.lineItems.map((line, index) => {
          return (
            <div key={index} className="line-item-row">
              <LineItem
                key={index}
                // index={index}
                // secLen={sectionData.lineItems.length}
                setHeaderStats={setHeaderStats}
                lineItemData={line}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
