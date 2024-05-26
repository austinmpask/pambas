import { useContext, useState, useEffect, useRef } from "react";
import UserContext from "../../context/UserContext";

export default function HamburgerMenu() {
  const userData = useContext(UserContext);

  const [active, setActive] = useState(false);

  const hamburgerRef = useRef(null);

  useEffect(() => {
    //Close the menu if the user clicks anything outside of it
    function handleOutsideClick(event) {
      if (
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setActive(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [hamburgerRef]);

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
                  <i className="fas fa-hand-sparkles"></i>
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
