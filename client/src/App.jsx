import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { useEffect } from "react";

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
      <Route path="/quiz" element={<Quiz />}></Route>
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/sign-up" element={<SignUp />}></Route>
    </Routes>
  );
}

export default App;
