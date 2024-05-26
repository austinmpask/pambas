export default function EngagementList() {
  return (
    <div className="navbar-item has-dropdown is-hoverable">
      <a className="navbar-link">Engagements</a>

      <div className="navbar-dropdown">
        <a className="navbar-item">Expensify</a>
        <a className="navbar-item is-selected">Radicle Health</a>
        <a className="navbar-item">Upwork</a>
        <hr className="navbar-divider" />
        <button className="button is-small">New Engagement</button>
      </div>
    </div>
  );
}
