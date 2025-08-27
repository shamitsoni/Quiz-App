import "./Home.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import RecentResult from "../Quiz/RecentResult";

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
    fetch(`http://localhost:5000/api/completed-quizzes/${user.id}`)
      .then((res) => res.json())
      .then((data) => setRecentQuizzes(data));
  }, [user.id]);

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

      <div className="recent-quiz-container">
        {recentQuizzes.map((quiz) => (
          <RecentResult key={quiz.id} quiz={quiz} onViewQuiz={handleViewQuiz} />
        ))}
      </div>
    </>
  );
}

export default Dashboard;
