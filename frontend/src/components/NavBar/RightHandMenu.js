import HamburgerMenu from "./HamburgerMenu";

export default function RightHandMenu() {
  return (
    <div className="navbar-end">
      <a
        className="navbar-burger"
        role="button"
        aria-label="menu"
        aria-expanded="false"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
      <HamburgerMenu />
    </div>
  );
}
