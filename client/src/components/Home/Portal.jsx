import "./Home.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

function Portal({ user, handleLogOut }) {
  useEffect(() => {
    document.title = `${user.username} | Portal`;
  }, []);

  return (
    <>
      <NavBar user={user} handleLogOut={handleLogOut} location="portal" />
      <div className="portal-body">
        <Link to="/quiz">
          <button className="content-btn">Play</button>
        </Link>
        <Link to="/stats">
          <button className="content-btn">Stats</button>
        </Link>
      </div>
    </>
  );
}

export default Portal;
