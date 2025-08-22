import "./Stats.css";
import { useEffect } from "react";

function Stats({ user, stats }) {
  useEffect(() => {
    document.title = `${user.username} | Stats`;
  }, []);

  if (!stats) {
    return <div>Loading stats...</div>;
  }
  return (
    <div className="stats-container">
      <h1>{user.username}'s stats</h1>
      <p>Quizzes Completed: {stats.quizzes_completed}</p>
      <p>Questions Answered: {stats.questions_answered}</p>
      <p>Questions Correct: {stats.questions_correct}</p>
      <p>
        Percentage Correct:{" "}
        {stats.questions_answered > 0
          ? (stats.questions_correct / stats.questions_answered) * 100
          : 0}
        %
      </p>
    </div>
  );
}

export default Stats;
