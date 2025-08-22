function SummaryScreen({ questions, answered, onClose, playAgain, time }) {
  const total = questions.length;
  const correct = answered.filter(
    (choice, i) => choice === questions[i].answer
  ).length;

  return (
    <div className="summary-screen">
      <h2>Quiz Completed!</h2>
      <p>
        Time elapsed: {Math.floor(time / 60)}:
        {String(time % 60).padStart(2, "0")}
      </p>

      <p>
        You answered {correct} out of {total} questions correctly.
      </p>

      <div className="button-group">
        <button className="btn btn-secondary" onClick={onClose}>
          Return to Questions
        </button>
        <button className="btn btn-secondary" onClick={playAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}

export default SummaryScreen;
