import { useContext } from "react";

import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

import ProjectListItem from "src/components/ProjectListItem";

//Dropdown menu for user's projects
export default function ProjectList() {
  //Array containing an obj for each project owned by user
  const projectData = useContext(ProjectSummaryContext);

  return (
    <div className="navbar-item has-dropdown is-hoverable">
      <a className="navbar-link">Projects</a>

      <div className="navbar-dropdown">
        {projectData.map((project, index) => {
          return <ProjectListItem key={index} projectName={project.title} />;
        })}

        <hr className="navbar-divider" />
        <a href="/new">
          <button className="button is-small">New Project</button>
        </a>
      </div>
    </div>
  );
}
