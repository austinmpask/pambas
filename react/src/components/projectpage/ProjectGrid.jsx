//Children
import { CSSTransition } from "react-transition-group";
import ProjectSection from "src/components/projectpage/ProjectSection";

//Grid interface displaying all of the user's projects
export default function ProjectGrid({
  contextSlice,
  projectDetails,
  setHeaderStats,
}) {
  return (
    <CSSTransition
      in={projectDetails}
      unmountOnExit
      timeout={460}
      classNames={"section"}
    >
      <div>
        <div className="grid-container has-background-light" />

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
      </div>
    </CSSTransition>
  );
}
