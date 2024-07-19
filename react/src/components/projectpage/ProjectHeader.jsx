//React
import { useContext, useEffect, useState } from "react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";

//Children

import ProjectEditableField from "src/components/projectpage/ProjectEditableField";
import { ProjectUpdaterContext } from "src/pages/ProjectPage";
import MeterButton from "./MeterButton";
import CircleMeter from "./CircleMeter";
import { createPortal } from "react-dom";

//Header containing editable project info. Uses slice of context provided by page wrapper parent
export default function ProjectHeader({ contextSlice, headerStats }) {
  const updateContext = useContext(ProjectUpdaterContext);

  return createPortal(
    <div className="card proj-card side-card page-wrapper">
      <div className="card-header proj-header">
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
        />
      </div>
      <div className="header-content">
        <MeterButton
          val={contextSlice.billed}
          displayVal={contextSlice.budget - contextSlice.billed}
          max={contextSlice.budget}
          color="blue"
          label="Budget Hours Remaining"
        />

        <MeterButton
          val={headerStats.openItems}
          max={1}
          color="red"
          label="Open Items"
        />
      </div>

      <footer className="card-footer">
        <div className="proj-footer has-text-grey-light">
          <span>{contextSlice.projectType}</span>
          <span>{contextSlice.projectManager}</span>
        </div>
      </footer>
    </div>,
    document.body
  );
}
