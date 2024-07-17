//React
import { Link } from "react-router-dom";
import CheckBoxButton from "../components/projectpage/CheckBoxButton";
import { useState } from "react";

export default function LandingPage() {
  const [active, setActive] = useState(false);
  return (
    <>
      <h1>Welcome to SOC Panda</h1>
      <div
        className="cell line-item-cell centered-cell click-cell"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <CheckBoxButton active={active} />
      </div>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/register">
        <button>Register</button>
      </Link>
    </>
  );
}
