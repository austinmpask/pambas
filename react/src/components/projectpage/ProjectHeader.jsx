//React
import { useContext } from "react";
import { createPortal } from "react-dom";

//Contexts
import {
  ProjectUpdaterContext,
  HeaderStatsContext,
} from "src/pages/ProjectPage";

//Children
import ProjectEditableField from "./ProjectEditableField";
import MeterButton from "./MeterButton";
import CircleMeter from "./CircleMeter";

// Project stats header containing editable project info. Uses slice of context provided by page wrapper parent
export default function ProjectHeader({ contextSlice }) {
  //Upate project summary context via key/val pair
  const updateContext = useContext(ProjectUpdaterContext);

  const { headerStats } = useContext(HeaderStatsContext);

  return createPortal(
    <div className="card proj-card side-card default-body-background page-wrapper">
      {/* Card header */}
      <div className="card-header proj-header default-header-color">
        <ProjectEditableField
          initialContent={contextSlice.title}
          objKey="title"
          onSubmit={updateContext}
          title={true}
        />
        <CircleMeter
          val={Math.round((headerStats.completed / headerStats.total) * 100)}
          max={100}
          percentage={true}
          size={42}
          color="green"
          fill="white"
        />
      </div>
      <div className="header-content">
        {/* Card content */}
        <MeterButton
          val={contextSlice.billed}
          displayVal={contextSlice.budget - contextSlice.billed}
          max={contextSlice.budget}
          color="blue"
          label="Budget Hours Remaining"
          type="bill"
          objKey="billed"
          onSubmit={updateContext}
        />

        <MeterButton
          val={headerStats.openItems}
          max={1}
          color="red"
          label="Open Items"
        />
      </div>

      <footer className="card-footer">
        {/* Card footer */}
        <div className="proj-footer has-text-grey-light">
          <span>{contextSlice.projectType}</span>
          <span>{contextSlice.projectManager}</span>
        </div>
      </footer>
    </div>,
    // Attach portal to top level
    document.body
  );
}
