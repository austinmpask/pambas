//React
import { useContext } from "react";

//Contexts
import { ProjectUpdaterContext } from "src/pages/ProjectPage";

//Children
import LineItem from "src/components/projectpage/LineItem";
import ProjectEditableField from "src/components/projectpage/ProjectEditableField";
import { LockoutContext } from "../../context/LockoutContext";

//Individual section within the project grid
export default function ProjectSection({
  contextSlice,
  sectionData,
  setHeaderStats,
  index,
}) {
  const updateProjectSummaryContext = useContext(ProjectUpdaterContext);
  const { lockout } = useContext(LockoutContext);
  //Apply a change to whatever index of the header array the user edited, then update context with that
  function updateHeaders(i, value) {
    const newHeaders = [...contextSlice.checkBoxHeaders];
    newHeaders[i] = value;

    //Update the object k/v in the project summary context list
    updateProjectSummaryContext("checkBoxHeaders", newHeaders);
  }

  return (
    <div className="card mt-6 section-card default-body-background">
      <div
        className="card-header sec-header default-header-color"
        style={lockout ? { boxShadow: "none" } : {}}
      >
        <div className="fixed-grid has-6-cols">
          {index ? (
            <div className="title-cell">
              <h2 className="title is-5 has-text-weight-medium has-text-white">{`Section ${sectionData.sectionNumber}`}</h2>
            </div>
          ) : (
            <div className="grid">
              <div className="title-cell">
                <h2
                  className="title is-5 has-text-weight-medium has-text-white"
                  style={{ position: "absolute" }}
                >{`Sec. ${sectionData.sectionNumber}`}</h2>
              </div>
              {contextSlice.checkBoxHeaders.map((header, i) => {
                return (
                  <div key={i} className="cell header-cell-centered">
                    {!index && (
                      <ProjectEditableField
                        initialContent={header}
                        objKey={i}
                        onSubmit={updateHeaders}
                        mini={true}
                      />
                    )}
                  </div>
                );
              })}
              <div className="cell header-cell-centered">
                <label className="section-header has-text-white">NOTES</label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed-grid has-6-cols">
        {sectionData.lineItems.map((line, index) => {
          return (
            <div key={index} className="line-item-row">
              <LineItem
                key={index}
                index={index}
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
