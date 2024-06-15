import ProjectList from "src/components/navbar/ProjectList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons";

//Left side of the navbar
export default function LeftHandMenu() {
  return (
    <div className="navbar-start">
      <a href="/dashboard" className="navbar-item">
        <span className="icon-text">
          <span className="icon">
            <FontAwesomeIcon icon={faTachometerAlt} />
          </span>
          <span>Dashboard</span>
        </span>
      </a>
      {/* Dropdown for current projects */}
      <ProjectList />
    </div>
  );
}
