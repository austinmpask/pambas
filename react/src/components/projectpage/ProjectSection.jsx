//React
import { useContext, createContext, useState } from "react";

//Contexts
import { ProjectUpdaterContext } from "src/pages/ProjectPage";
import { LockoutContext } from "src/context/LockoutContext";

//Children
import LineItem from "src/components/projectpage/lineitem/LineItem";
import ProjectEditableField from "src/components/projectpage/ProjectEditableField";
import LineItemWrapper from "./lineitem/LineItemWrapper";

//Individual project section within the project grid
export default function ProjectSection({
  contextSlice,
  sectionData,
  setHeaderStats,
  index,
}) {
  //Updates project summary context slice with specific key/value
  const updateProjectSummaryContext = useContext(ProjectUpdaterContext);

  //Tracks if user is interacting with a cell currently
  const { lockout } = useContext(LockoutContext);

  //Apply a change to whatever index of the header array the user edited, then use context updater
  function updateHeaders(i, value) {
    //Copy header array & insert new value at correct index
    const newHeaders = [...contextSlice.checkBoxHeaders];
    newHeaders[i] = value;

    //Update the object k/v in the project summary context list
    updateProjectSummaryContext("checkBoxHeaders", newHeaders);
  }

  return (
    <div className="card mt-6 section-card default-body-background">
      {/* Header for section card */}
      <div
        className="card-header sec-header default-header-color"
        style={lockout ? { boxShadow: "none" } : {}}
      >
        <div className="fixed-grid has-6-cols">
          {/* Column headers shown on only on first card (index === 0) */}
          {index ? (
            // Rest of cards headers
            <div className="title-cell">
              <h2 className="title is-5 has-text-weight-medium has-text-white">{`Section ${sectionData.sectionNumber}`}</h2>
            </div>
          ) : (
            // First card header
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

      {/* Section card content (line items) */}
      <div className="fixed-grid has-6-cols">
        {sectionData.lineItems.map((line, index) => (
          <div key={index} className="line-item-row">
            <LineItemWrapper
              line={line}
              setHeaderStats={setHeaderStats}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
