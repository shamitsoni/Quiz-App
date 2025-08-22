import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Stats from "./components/Stats";

function App() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoadingUser(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/stats/${user.id}`)
        .then((res) => res.json())
        .then((data) => setStats(data));
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home user={user} handleLogOut={logout} />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route
        path="/quiz"
        element={
          <ProtectedRoute user={user}>
            <Quiz user={user} stats={stats} setStats={setStats} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute user={user}>
            <Stats user={user} stats={stats} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
