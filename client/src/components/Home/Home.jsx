import "./Home.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

function Home({ user, handleLogOut }) {
  useEffect(() => {
    document.title = "Welcome | Home";
  }, []);

  return (
    <>
      <NavBar user={user} handleLogOut={handleLogOut} />
      <div className="home-container">
        {user && (
          <>
            <Link to="/quiz">
              <button className="content-btn">Play</button>
            </Link>
            <Link to="/stats">
              <button className="content-btn">Stats</button>
            </Link>
          </>
        )}
      </div>
    </>
  );
}

export default Home;
