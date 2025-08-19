import "./Home.css";
import { useEffect } from "react";
import { Link } from "react-router";

function Home() {
  useEffect(() => {
    document.title = "Home";
  }, []);
  return (
    <div className="home-container">
      <h1>Welcome to Trivia App</h1>
      <Link to="/quiz">
        <button className="btn btn-primary">Get Started</button>
      </Link>
    </div>
  );
}

export default Home;
