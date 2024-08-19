//Children
import HamburgerMenu from "src/components/navbar/HamburgerMenu";

//Right side of navbar
export default function RightHandMenu() {
  return (
    <div className="navbar-end">
      <span className="navbar-item has-text-danger">DEV</span>
      <HamburgerMenu />
    </div>
  );
}
