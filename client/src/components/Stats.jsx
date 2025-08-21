function Stats({ stats }) {
  return (
    <div>
      <p>Quizzes Completed: {stats.quizzes_completed}</p>
      <p>Questions Answered: {stats.questions_answered}</p>
      <p>Questions Correct: {stats.questions_correct}</p>
    </div>
  );
}

export default Stats;
