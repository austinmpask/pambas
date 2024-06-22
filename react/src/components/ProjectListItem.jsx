//Line item on navbar to navigate to a specific project
export default function ProjectListItem({ id, projectName }) {
  return (
    <a href={`/project/${id}`} className="navbar-item">
      {projectName}
    </a>
  );
}
