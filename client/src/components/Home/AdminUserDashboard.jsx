import "./Home.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "./NavBar";
import RecentResult from "../Quiz/RecentResult";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function AdminUserDashboard({ user }) {
  const { userId } = useParams();
  const [viewUser, setViewUser] = useState();
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetch(`${SERVER_URL}/api/admin/users/${userId}`, {
        headers: {
          "x-user-id": user.id,
        },
      })
        .then((res) => res.json())
        .then((data) => setViewUser(data));
    }
  }, [userId]);

  const handleViewQuiz = (quizId) => {
    navigate(`/review/${quizId}`, { state: { userId: viewUser.id } });
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
    navigate(`/share/${shareId}`);
  };

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  useEffect(() => {
    if (viewUser && viewUser.id) {
      fetch(`${SERVER_URL}/api/completed-quizzes/${viewUser.id}`)
        .then((res) => res.json())
        .then((data) => setRecentQuizzes(data));
    }
  }, [viewUser?.id]);

  return (
    <>
      <NavBar user={viewUser} location="adminUserDashboard" />
      <main className="dashboard-grid">
        <section className="dashboard-btns">
          <button
            className="content-btn"
            onClick={() => navigate(`/admin/user/${viewUser.id}/stats`)}
          >
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

export default AdminUserDashboard;
