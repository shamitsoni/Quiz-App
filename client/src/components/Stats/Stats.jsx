import "./Stats.css";
import NavBar from "../Home/NavBar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Stats({ user, stats, adminView }) {
  const { userId } = useParams();
  const [currUser, setCurrUser] = useState(user);
  const [userStats, setUserStats] = useState(stats);

  useEffect(() => {
    if (userId) {
      fetch(`${SERVER_URL}/api/admin/users/${userId}`)
        .then((res) => res.json())
        .then((data) => setCurrUser(data));
    }
  }, [userId]);

  useEffect(() => {
    if (currUser && currUser.username) {
      document.title = `${currUser.username} | Stats`;
    }
  }, [currUser?.username]);

  useEffect(() => {
    if (currUser && currUser.id) {
      fetch(`${SERVER_URL}/api/stats/${currUser.id}`)
        .then((res) => res.json())
        .then((data) => setUserStats(data));
    }
  }, [adminView, currUser?.id]);

  if (!userStats) {
    return <div>Loading stats...</div>;
  }
  return (
    <>
      <NavBar user={currUser} location="stats" />

      <div className="stats-container">
        <p>Quizzes Completed: {userStats.quizzes_completed}</p>
        <p>Questions Answered: {userStats.questions_answered}</p>
        <p>Questions Correct: {userStats.questions_correct}</p>
        <p>
          Percentage Correct:{" "}
          {userStats.questions_answered > 0
            ? // Multiply percentage by 100 again before truncation and then divide by 100 to keep two decimal places
              Math.trunc(
                (userStats.questions_correct / userStats.questions_answered) *
                  100 *
                  100
              ) / 100
            : 0}
          %
        </p>
        <p>
          Total Time Spent: {Math.floor(userStats.time_elapsed / 60)}:
          {String(userStats.time_elapsed % 60).padStart(2, "0")}
        </p>
      </div>
    </>
  );
}

export default Stats;
