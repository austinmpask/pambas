import ProjectSection from "src/components/projectpage/ProjectSection";

export default function ProjectGrid({ projectData }) {
  return (
    <div className="container">
      {projectData.sections.map((section) => {
        return (
          <ProjectSection
            checkBoxHeaders={projectData.checkBoxHeaders}
            sectionData={section}
          />
        );
      })}
    </div>
  );
}
