//React
import { CSSTransition } from "react-transition-group";

//Children
import ProjectSection from "src/components/projectpage/ProjectSection";

//Utils
import { UIVars } from "src/utils/validations";

//Grid interface displaying all of the user's projects
export default function ProjectGrid({ contextSlice, projectDetails }) {
  return (
    // Roll in the section cards from top
    <CSSTransition
      in={projectDetails}
      unmountOnExit
      timeout={UIVars.PROJ_GRID_IN_ANIM_MS}
      classNames={"section"}
    >
      <div className="project-content">
        {projectDetails &&
          projectDetails.sections.map((section, index) => {
            return (
              <ProjectSection
                contextSlice={contextSlice}
                sectionData={section}
                index={index}
                key={index}
              />
            );
          })}
      </div>
    </CSSTransition>
  );
}
