import "./Flashcard.css";

function Flashcard({
  index,
  question,
  answer,
  showAnswer,
  setShowAnswer,
  answered,
}) {
  const handleClick = () => {
    if (answered) {
      setShowAnswer(!showAnswer);
    }
  };

  const cardContent = showAnswer ? answer : question;

  return (
    <div
      key={index}
      onClick={handleClick}
      className={`flashcard ${
        showAnswer ? "flashcard-answer" : "flashcard-question"
      }`}
      style={{ cursor: answered ? "pointer" : "not-allowed" }}
    >
      <p
        className={`flashcard-text ${
          showAnswer ? "flashcard-text-answer" : "flashcard-text-question"
        }`}
      >
        {cardContent}
      </p>
    </div>
  );
}

export default Flashcard;
