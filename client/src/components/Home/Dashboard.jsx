import "./Home.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

function Dashboard({ user, handleLogOut }) {
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <>
      <NavBar user={user} handleLogOut={handleLogOut} location="dashboard" />
      <div className="dashboard-body">
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

export default Dashboard;
