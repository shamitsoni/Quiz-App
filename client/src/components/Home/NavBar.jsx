import { Link } from "react-router-dom";

function NavBar({ user, location, handleLogOut, onExit }) {
  const titles = {
    home: "Trivia App",
    dashboard: user && `Welcome, ${user.username}!`,
    quiz: "Attempting Quiz",
    review: "Reviewing Quiz",
    stats: user && `${user.username}'s Stats`,
  };

  const navTitle = titles[location] || "Trivia App";
  const navActions = getNavActions(user, location, handleLogOut, onExit);

  return (
    <nav className="navbar">
      <div className="navbar-title">{navTitle}</div>
      <div className="navbar-actions">{navActions}</div>
    </nav>
  );
}

function getNavActions(user, location, handleLogOut, onExit) {
  if (!user) {
    return (
      <>
        <Link to="/login">
          <button className="navbar-btn">Login</button>
        </Link>
        <Link to="/sign-up">
          <button className="navbar-btn">Sign Up</button>
        </Link>
      </>
    );
  }

  switch (location) {
    case "dashboard":
      return (
        <button onClick={handleLogOut} className="navbar-btn">
          Logout
        </button>
      );
    case "quiz":
      return (
        <>
          <button className="navbar-btn" onClick={onExit}>
            Back to Dashboard
          </button>
        </>
      );
    case "review":
      return (
        <>
          <button className="navbar-btn" onClick={onExit}>
            Back to Dashboard
          </button>
        </>
      );
    case "stats":
      return (
        <>
          <Link to="/dashboard">
            <button className="navbar-btn">Back to Dashboard</button>
          </Link>
        </>
      );
    default:
      return (
        <button onClick={handleLogOut} className="navbar-btn">
          Logout
        </button>
      );
  }
}

export default NavBar;
