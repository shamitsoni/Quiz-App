function RecentResult({ quiz }) {
  return (
    <div className="recent-quiz">
      <p>Date: {quiz.date_completed}</p>
      <p>Questions: {quiz.total_questions}</p>
      <p>Score: {quiz.score}</p>
      <p>Time Spent: {quiz.time_spent}s</p>
    </div>
  );
}

export default RecentResult;
