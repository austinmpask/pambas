export default function EngagementList() {
  return (
    <div class="navbar-item has-dropdown is-hoverable">
      <a class="navbar-link">Engagements</a>

      <div class="navbar-dropdown">
        <a class="navbar-item">Expensify</a>
        <a class="navbar-item is-selected">Radicle Health</a>
        <a class="navbar-item">Upwork</a>
        <hr class="navbar-divider" />
        <button class="button is-small">New Engagement</button>
      </div>
    </div>
  );
}
