import { useContext } from "react";

import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

import ProjectListItem from "src/components/navbar/ProjectListItem";

//Dropdown menu for user's projects
export default function ProjectList() {
  //Array containing an obj for each project owned by user
  const { projectSummaryData } = useContext(ProjectSummaryContext);

  return (
    <div className="navbar-item has-dropdown is-hoverable">
      <a className="navbar-link">Projects</a>

      <div className="navbar-dropdown">
        {projectSummaryData.map((project, index) => {
          return (
            <ProjectListItem
              key={index}
              id={project.id}
              projectName={project.title}
            />
          );
        })}

        <hr className="navbar-divider" />
        <a href="/new">
          <button className="button is-small">New Project</button>
        </a>
      </div>
    </div>
  );
}