import EngagementList from "src/components/navbar/EngagementList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons";

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

      <EngagementList />
    </div>
  );
}
