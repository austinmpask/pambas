//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons";

//Children
import ProjectList from "src/components/navbar/ProjectList";

//Left side of the navbar
export default function LeftHandMenu() {
  return (
    <div className="navbar-start">
      <a href="/dashboard" className="navbar-item">
          <span>Dashboard</span>
        {/* <span className="icon-text">
          <span className="icon">
            <FontAwesomeIcon icon={faTachometerAlt} />
          </span>
        </span> */}
      </a>
      {/* <a href="/timesheet" className="navbar-item">
        <span>Timesheets</span>
      </a> */}
      {/* Dropdown for current projects */}
      <ProjectList />
    </div>
  );
}
