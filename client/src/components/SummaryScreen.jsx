function SummaryScreen({ questions, answered, onClose }) {
  const total = questions.length;
  const correct = answered.filter(
    (choice, i) => choice === questions[i].answer
  ).length;

  return (
    <div className="summary-screen">
      <h2>Quiz Completed!</h2>
      <p>
        You answered {correct} out of {total} questions correctly.
      </p>

      <button onClick={onClose}>Return to Questions</button>
    </div>
  );
}

export default SummaryScreen;
