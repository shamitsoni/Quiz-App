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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Routes>
      <Route path="/" element={<Home user={user} handleLogOut={logout} />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route
        path="/quiz"
        element={
          <ProtectedRoute user={user}>
            <Quiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <ProtectedRoute user={user}>
            <Stats />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
