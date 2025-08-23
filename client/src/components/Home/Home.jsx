import "./Home.css";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import NavBar from "./NavBar";

function Home({ user, handleLogOut }) {
  useEffect(() => {
    document.title = "Welcome | Home";
  }, []);

  if (user) {
    return <Navigate to="/portal" replace />;
  }

  return (
    <>
      <NavBar user={user} handleLogOut={handleLogOut} location="home" />
      <div className="home-container"></div>
    </>
  );
}

export default Home;
