import "./Home.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import RecentResult from "../Quiz/RecentResult";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Dashboard({ user, handleLogOut }) {
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const navigate = useNavigate();

  const handleViewQuiz = (quizId) => {
    navigate(`/review/${quizId}`);
  };

  const handleDownload = async (quizId) => {
    const res = await fetch(
      `${SERVER_URL}/api/completed-quizzes/${quizId}/download`
    );
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-${quizId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async (quizId) => {
    const res = await fetch(
      `${SERVER_URL}/api/completed-quizzes/${quizId}/share`
    );
    const data = await res.json();
    const shareId = data.id;
    const url = `${window.location.origin}/share/${shareId}`;
    navigator.clipboard.writeText(url);
  };

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/completed-quizzes/${user.id}`)
      .then((res) => res.json())
      .then((data) => setRecentQuizzes(data));
  }, [user.id]);

  const location = user.is_admin ? "adminDashboard" : "dashboard";

  return (
    <>
      <NavBar user={user} handleLogOut={handleLogOut} location={location} />
      <main className="dashboard-grid">
        <section className="dashboard-btns">
          <button className="content-btn" onClick={() => navigate("/quiz")}>
            Play
          </button>

          <button className="content-btn" onClick={() => navigate("/stats")}>
            Stats
          </button>
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
                onDownload={handleDownload}
                onShare={handleShare}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Dashboard;
