//React
import { useContext, useState } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";

//Children
import ProgressBar from "@ramonak/react-progress-bar";
import ProjectEditableField from "src/components/projectpage/ProjectEditableField";
import { ProjectUpdaterContext } from "src/pages/ProjectPage";

//Header containing editable project info. Uses slice of context provided by page wrapper parent
export default function ProjectHeader({ contextSlice }) {
  //State of the billing input field (temprarily here)
  const [billing, setBilling] = useState("");

  const updateContext = useContext(ProjectUpdaterContext);

  return (
    contextSlice && (
      <div className="m-6">
        <div className="card title-card page-wrapper">
          <div className="card-header p-4">
            <ProjectEditableField
              initialContent={contextSlice.title}
              objKey="title"
              onSubmit={updateContext}
              title={true}
            />
          </div>
          <div className="card-content">
            <ProgressBar
              height="3px"
              bgColor="#23db5e"
              isLabelVisible={false}
              completed={contextSlice.billed}
              maxCompleted={contextSlice.budget}
            />
            <div className="block mt-2">
              <span>{`${
                contextSlice.budget - contextSlice.billed
              } hours remaining`}</span>

              {/* <input
                className="input"
                type="number"
                value={billing}
                onChange={(e) => setBilling(e.target.value)}
              /> */}
            </div>
          </div>
          <footer className="card-footer">
            <button
              className="card-footer-item"
              onClick={() =>
                updateContext("billed", contextSlice.billed + Number(billing))
              }
            >
              <span className="icon-text">
                <span className="icon">
                  <FontAwesomeIcon icon={faReceipt} />
                </span>
                <span>Bill it</span>
              </span>
            </button>
          </footer>
        </div>
      </div>
    )
  );
}
