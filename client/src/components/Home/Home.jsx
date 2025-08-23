import "./Home.css";
import { useEffect } from "react";
import NavBar from "./NavBar";

function Home({ user, handleLogOut }) {
  useEffect(() => {
    document.title = "Welcome | Home";
  }, []);

  return (
    <>
      <NavBar user={user} handleLogOut={handleLogOut} location="home" />
      <div className="home-container"></div>
    </>
  );
}

export default Home;
