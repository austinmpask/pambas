import { useContext } from "react";
import UserContext from "../../context/UserContext";

export default function HamburgerMenu() {
  const userData = useContext(UserContext);

  return (
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
        <a href="#" className="card-footer-item">
          Settings
        </a>
        <a href="#" className="card-footer-item">
          Log out
        </a>
      </footer>
    </div>
  );
}
