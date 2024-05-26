import LeftHandMenu from "./LeftHandMenu";
import RightHandMenu from "./RightHandMenu";

export default function NavBar() {
  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div id="navbarBasicExample" className="navbar-menu">
          <LeftHandMenu />
          <RightHandMenu />
        </div>
      </nav>
    </>
  );
}
