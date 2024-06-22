export default function ProjectHeader({ projectData }) {
  return (
    <>
      <div class="block">
        <span>{projectData.projectType}</span>
      </div>
      <div class="block">
        <span>{`${
          projectData.budget - projectData.billed
        } hours remaining`}</span>
      </div>
      <div class="block">
        <span>{`PM: ${projectData.projectManager}`}</span>
      </div>
    </>
  );
}
