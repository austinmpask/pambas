//React
import { CSSTransition } from "react-transition-group";

//Children
import ProjectSection from "src/components/projectpage/ProjectSection";

//Grid interface displaying all of the user's projects
export default function ProjectGrid({
  contextSlice,
  projectDetails,
  setHeaderStats,
}) {
  return (
    // Roll in the section cards from top
    <CSSTransition
      in={projectDetails}
      unmountOnExit
      timeout={460}
      classNames={"section"}
    >
      <div className="project-content">
        {projectDetails &&
          projectDetails.sections.map((section, index) => {
            return (
              <ProjectSection
                contextSlice={contextSlice}
                sectionData={section}
                setHeaderStats={setHeaderStats}
                index={index}
                key={index}
              />
            );
          })}
      </div>
    </CSSTransition>
  );
}
