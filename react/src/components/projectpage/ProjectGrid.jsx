import ProjectSection from "src/components/projectpage/ProjectSection";

export default function ProjectGrid({ projectData }) {
  return (
    <div className="container">
      {projectData.sections.map((section, index) => {
        return (
          <ProjectSection
            checkBoxHeaders={projectData.checkBoxHeaders}
            sectionData={section}
            index={index}
            key={index}
          />
        );
      })}
    </div>
  );
}
