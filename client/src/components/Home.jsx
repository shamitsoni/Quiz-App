import "./Home.css";
import { useEffect } from "react";
import { Link } from "react-router";

function Home({ user }) {
  useEffect(() => {
    document.title = "Home";
  }, []);

  if (user) {
    return (
      <div className="home-container">
        <h1>Trivia App</h1>
        <p>Welcome, {user.username}</p>
        <div className="button-group">
          <Link to="/quiz">
            <button className="btn btn-primary">Try Quiz</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1>Trivia App</h1>
      <div className="button-group">
        <Link to="/login">
          <button className="btn btn-primary">Login</button>
        </Link>
        <Link to="/sign-up">
          <button className="btn btn-primary">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
