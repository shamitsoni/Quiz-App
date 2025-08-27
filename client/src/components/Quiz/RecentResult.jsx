function RecentResult({ quiz }) {
  // Parse and format date string from DB
  const date = new Date(quiz.date_completed);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="recent-quiz">
      <p>
        Date: {formattedDate}; {formattedTime}
      </p>
      <p>Questions: {quiz.total_questions}</p>
      <p>Score: {quiz.score}</p>
      <p>Time Spent: {quiz.time_spent}s</p>
      <button>View Quiz</button>
    </div>
  );
}

export default RecentResult;
