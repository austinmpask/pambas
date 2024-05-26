import EngagementList from "./EngagementList";
import { useNavigate } from "react-router-dom";

export default function LeftHandMenu() {
  const navigate = useNavigate();
  function handleClick(event) {
    event.preventDefault();
    navigate("/dashboard");
  }
  return (
    <div className="navbar-start">
      <a className="navbar-item">
        <span className="icon-text" onClick={handleClick}>
          <span className="icon">
            <i className="fas fa-tachometer-alt"></i>
          </span>
          <span>Dashboard</span>
        </span>
      </a>

      <EngagementList />
    </div>
  );
}
