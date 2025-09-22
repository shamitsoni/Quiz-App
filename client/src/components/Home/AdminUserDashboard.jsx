import "./Home.css";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "./NavBar";
import RecentResult from "../Quiz/RecentResult";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function AdminUserDashboard() {
  const { userId } = useParams();
  const [viewUser, setViewUser] = useState();
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetch(`${SERVER_URL}/api/admin/users/${userId}`)
        .then((res) => res.json())
        .then((data) => setViewUser(data));
    }
  }, [userId]);

  const handleViewQuiz = (quizId) => {
    navigate(`/review/${quizId}`, { state: { userId: viewUser.id } });
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

export default AdminUserDashboard;
