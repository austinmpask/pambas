import EngagementList from "./EngagementList";

export default function LeftHandMenu() {
  return (
    <div className="navbar-start">
      <a href="/dashboard" className="navbar-item">
        <span className="icon-text">
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
