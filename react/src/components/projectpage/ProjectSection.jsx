//Children
import LineItem from "src/components/projectpage/LineItem";
import ProjectEditableField from "src/components/projectpage/ProjectEditableField";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { ProjectUpdaterContext } from "../../pages/ProjectPage";

//Individual section within the project grid
export default function ProjectSection({ contextSlice, sectionData, index }) {
  const updateContext = useContext(ProjectUpdaterContext);
  //Apply a change to whatever index of the header array the user edited, then update context with that
  function updateHeaders(i, value) {
    const newHeaders = [...contextSlice.checkBoxHeaders];
    newHeaders[i] = value;

    updateContext("checkBoxHeaders", newHeaders);
  }

  return (
    <div className="card mb-6 section-card">
      <div className="card-header">
        <h2 className="title is-4 has-text-weight-bold m-4">{`Section ${sectionData.sectionNumber}`}</h2>
      </div>
      <div className="fixed-grid has-6-cols m-4">
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
                index={index}
                secLen={sectionData.lineItems.length}
                lineItemData={line}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
