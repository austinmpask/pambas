//Children
import LeftHandMenu from "src/components/navbar/LeftHandMenu";
import RightHandMenu from "src/components/navbar/RightHandMenu";

// Parent persistent navbar component
export default function NavBar() {
  return (
    <>
      <nav
        className="navbar has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div id="navbarBasicExample" className="navbar-menu">
          <LeftHandMenu />
          <RightHandMenu />
        </div>
      </nav>
    </>
  );
}
