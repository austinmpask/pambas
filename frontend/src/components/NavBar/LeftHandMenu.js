import EngagementList from "./EngagementList";

export default function LeftHandMenu() {
  return (
    <div class="navbar-start">
      <a class="navbar-item">
        <span class="icon-text">
          <span class="icon">
            <i class="fas fa-tachometer-alt"></i>
          </span>
          <span>Dashboard</span>
        </span>
      </a>

      <EngagementList />
    </div>
  );
}
