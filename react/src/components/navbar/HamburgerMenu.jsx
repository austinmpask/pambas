import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "src/context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandSparkles } from "@fortawesome/free-solid-svg-icons";

export default function HamburgerMenu() {
  const { userData } = useContext(UserContext);

  //State for controlling hamburger menu visibility
  const [active, setActive] = useState(false);

  //Use ref to identify the hamburger menu to allow outside clicks to close it
  const hamburgerRef = useRef(null);

  useEffect(() => {
    //Close the menu if the user clicks anything outside of it
    function handleOutsideClick(event) {
      //Make sure hamburger menu has been rendered, and check that the click event is not coming from the hamburger menu
      if (
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        //Trigger rerender with menu gone
        setActive(false);
      }
    }

    //Listen for clicks on whole document
    document.addEventListener("mousedown", handleOutsideClick);

    //Cleanup on unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  //Toggle the hamburger menu by changing active state
  function handleClick(event) {
    event.preventDefault();
    setActive((prev) => !prev);
  }

  return (
    <div ref={hamburgerRef} className="hamburger-div">
      <a
        className={`navbar-burger ${active ? "is-active" : ""}`}
        role="button"
        aria-label="menu"
        onClick={handleClick}
        name="hamburger"
      >
        {/* For bulma visuals */}
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>

      {active && (
        <div className="card hamburger-card">
          <header className="card-header hamburger-card-header">
            <p className="card-header-title">
              <span className="icon-text">
                <span className="icon">
                  <FontAwesomeIcon icon={faHandSparkles} />
                </span>
                <span>Hi, {userData.firstName}</span>
              </span>
            </p>
          </header>
          <div className="card-content">
            <div className="content">
              <p>
                {userData.firstName} {userData.lastName}
              </p>
              <p>{userData.email}</p>
              <p>{userData.username}</p>
            </div>
          </div>
          <footer className="card-footer">
            <a href="/settings" className="card-footer-item">
              Settings
            </a>
            <a href="/logout" className="card-footer-item">
              Log out
            </a>
          </footer>
        </div>
      )}
    </div>
  );
}
