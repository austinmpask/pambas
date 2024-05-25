import HamburgerMenu from "./HamburgerMenu";

export default function RightHandMenu() {
  return (
    <div class="navbar-end">
      <a
        class="navbar-burger"
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
