export default function ProjectHeader({ projectData }) {
  console.log(projectData);
  return (
    <div className="block mb-4">
      <div className="block">
        <span>{projectData.projectType}</span>
      </div>
      <div className="block">
        <span>{`${
          projectData.budget - projectData.billed
        } hours remaining`}</span>
      </div>
      <div className="block">
        <span>{`PM: ${projectData.projectManager}`}</span>
      </div>
    </div>
  );
}
