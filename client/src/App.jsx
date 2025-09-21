import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/Home/Home";
import AdminDashboard from "./components/Home/AdminDashboard";
import Dashboard from "./components/Home/Dashboard";
import Quiz from "./components/Quiz/Quiz";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Stats from "./components/Stats/Stats";
import ReviewQuiz from "./components/Quiz/ReviewQuiz";
import VerifyDetails from "./components/Auth/VerifyDetails";
import ResetPassword from "./components/Auth/ResetPassword";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
    setLoadingUser(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`${SERVER_URL}/api/stats/${user.id}`)
        .then((res) => res.json())
        .then((data) => setStats(data));
    }
  }, [user]);

  const logout = () => {
    navigate("/");
    setUser(null);
    localStorage.removeItem("user");
  };

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/" element={<Home user={user} handleLogOut={logout} />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/verify-details" element={<VerifyDetails />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user} redirectTo={"/"}>
            <Dashboard user={user} handleLogOut={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz"
        element={
          <ProtectedRoute user={user} redirectTo={"/login"}>
            <Quiz user={user} stats={stats} setStats={setStats} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute user={user} redirectTo={"/login"}>
            <Stats user={user} stats={stats} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review/:quizId"
        element={
          <ProtectedRoute user={user} redirectTo={"/login"}>
            <ReviewQuiz user={user} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>
      <a href="/">Go Home</a>
    </div>
  );
}

export default App;
