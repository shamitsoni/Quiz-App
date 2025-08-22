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
          ? // Multiply percentage by 100 again before truncation and then divide by 100 to keep two decimal places
            Math.trunc(
              (stats.questions_correct / stats.questions_answered) * 100 * 100
            ) / 100
          : 0}
        %
      </p>
      <p>
        Total Time Spent: {Math.floor(stats.time_elapsed / 60)}:
        {String(stats.time_elapsed % 60).padStart(2, "0")}
      </p>
    </div>
  );
}

export default Stats;
