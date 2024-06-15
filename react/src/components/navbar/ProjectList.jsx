//Dropdown menu for user's projects
//TODO: Remove placeholders
export default function ProjectList() {
  return (
    <div className="navbar-item has-dropdown is-hoverable">
      <a className="navbar-link">Projects</a>

      <div className="navbar-dropdown">
        <a className="navbar-item">Expensify</a>
        <a className="navbar-item is-selected">Radicle Health</a>
        <a className="navbar-item">Upwork</a>
        <hr className="navbar-divider" />
        <a href="/new">
          <button className="button is-small">New Project</button>
        </a>
      </div>
    </div>
  );
}
