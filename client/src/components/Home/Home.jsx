import "./Home.css";
import { useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import NavBar from "./NavBar";

function Home({ user, handleLogOut }) {
  useEffect(() => {
    document.title = "Welcome | Home";
  }, []);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <NavBar user={user} handleLogOut={handleLogOut} location="home" />
      <div className="home-container">
        <section className="intro-section">
          <h2 className="section-title">Welcome to Trivia App! </h2>
          <p>Challenge yourself with fun quizzes and track your progress.</p>
        </section>

        <section className="how-section">
          <h2 className="section-title">How to Play</h2>
          <ul>
            <li>Sign up or log in to start playing quizzes.</li>
            <li>Answer trivia questions and get instant feedback.</li>
            <li>Track your stats and progress over time.</li>
          </ul>
        </section>

        <section className="start-section">
          <h2 className="section-title">Get Started</h2>
          <Link to="/login">
            <button className="content-btn">Log In</button>
          </Link>
          <Link to="/sign-up">
            <button className="content-btn">Sign Up</button>
          </Link>
        </section>
      </div>
    </>
  );
}

export default Home;
