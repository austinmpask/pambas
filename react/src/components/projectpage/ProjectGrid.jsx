//Children
import ProjectSection from "src/components/projectpage/ProjectSection";

//Grid interface displaying all of the user's projects
export default function ProjectGrid({
  contextSlice,
  projectDetails,
  setHeaderStats,
}) {
  return (
    projectDetails && (
      <div className="grid-container pb-6">
        {projectDetails.sections.map((section, index) => {
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
    )
  );
}
