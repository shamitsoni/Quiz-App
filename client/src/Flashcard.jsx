import "./Flashcard.css";

function Flashcard(props) {
  const handleClick = () => {
    props.setShowAnswer(!props.showAnswer);
  };

  const cardContent = props.showAnswer ? props.answer : props.question;

  return (
    <div
      key={props.index}
      onClick={handleClick}
      className={`flashcard ${
        props.showAnswer ? "flashcard-answer" : "flashcard-question"
      }`}
    >
      <p
        className={`flashcard-text ${
          props.showAnswer ? "flashcard-text-answer" : "flashcard-text-question"
        }`}
      >
        {cardContent}
      </p>
    </div>
  );
}

export default Flashcard;
