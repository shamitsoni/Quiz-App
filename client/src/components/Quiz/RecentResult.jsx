function RecentResult({ quiz, onViewQuiz, onDownload, onShare }) {
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

      <div className="recent-quiz-bar">
        {quiz.questions.map((ques, index) => {
          // Find the user's answer matching with the question number
          const userAnswerObj = quiz.user_answers.find(
            (ans) => ans.questionIndex === index
          );
          const isCorrect =
            userAnswerObj && userAnswerObj.selectedAnswer === ques.answer;

          // Render correct/incorrect segments and provide title on hover
          return (
            <span
              key={index}
              className={`bar-piece ${isCorrect ? "correct" : "incorrect"}`}
              title={`Q${index + 1}: ${isCorrect ? "Correct" : "Incorrect"}`}
            />
          );
        })}
      </div>

      <div className="quiz-btns" style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => onViewQuiz(quiz.id)} className="view-btn">
          View Quiz
        </button>

        <button onClick={() => onDownload(quiz.id)} className="view-btn">
          Download
        </button>

        <button onClick={() => onShare(quiz.id)} className="view-btn">
          Share
        </button>
      </div>
    </div>
  );
}

export default RecentResult;
