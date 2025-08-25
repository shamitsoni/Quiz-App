import { Link } from "react-router-dom";

function NavBar({ user, handleLogOut, location }) {
  return (
    <nav className="navbar">
      <div className="navbar-title">
        {location === "dashboard" ? (
          <span>Welcome, {user.username}</span>
        ) : (
          <span>Trivia App</span>
        )}
      </div>
      <div className="navbar-actions">
        {user ? (
          <button onClick={handleLogOut} className="navbar-btn">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">
              <button className="navbar-btn">Login</button>
            </Link>
            <Link to="/sign-up">
              <button className="navbar-btn">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
