import "./Home.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import RecentResult from "../Quiz/RecentResult";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Dashboard({ user, handleLogOut }) {
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const navigate = useNavigate();

  const handleViewQuiz = (quizId) => {
    navigate(`/review/${quizId}`);
  };

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/completed-quizzes/${user.id}`)
      .then((res) => res.json())
      .then((data) => setRecentQuizzes(data));
  }, [user.id]);

  return (
    <>
      <NavBar user={user} handleLogOut={handleLogOut} location="dashboard" />
      <main className="dashboard-grid">
        <section className="dashboard-btns">
          <Link to="/quiz">
            <button className="content-btn">Play</button>
          </Link>
          <Link to="/stats">
            <button className="content-btn">Stats</button>
          </Link>
        </section>

        <section className="recent-results-section">
          <header>
            <h1 className="recent-quiz-header">Recent Results</h1>
          </header>
          <div className="recent-quiz-container">
            {recentQuizzes.map((quiz) => (
              <RecentResult
                key={quiz.id}
                quiz={quiz}
                onViewQuiz={handleViewQuiz}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Dashboard;
