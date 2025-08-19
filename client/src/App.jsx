import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
  const [user, setUser] = useState(null);
  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route path="/quiz" element={<Quiz />}></Route>
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/sign-up" element={<SignUp />}></Route>
    </Routes>
  );
}

export default App;
