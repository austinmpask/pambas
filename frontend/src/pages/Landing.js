import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <>
      <h1>Welcome to SOC Panda</h1>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/register">
        <button>Register</button>
      </Link>
    </>
  );
}
