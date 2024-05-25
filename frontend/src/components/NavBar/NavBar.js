import LeftHandMenu from "./LeftHandMenu";
import RightHandMenu from "./RightHandMenu";

export default function NavBar() {
  return (
    <>
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div id="navbarBasicExample" class="navbar-menu">
          <LeftHandMenu />
          <RightHandMenu />
        </div>
      </nav>
    </>
  );
}
