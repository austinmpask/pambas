//Children
import ProjectSection from "src/components/projectpage/ProjectSection";

//Grid interface displaying all of the user's projects
export default function ProjectGrid({ contextSlice, projectDetails }) {
  return (
    <div className="m-3 flex flex-col items-center">
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
  );
}
