import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz" element={<Quiz />}></Route>
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />}></Route>
    </Routes>
  );
}

export default App;
