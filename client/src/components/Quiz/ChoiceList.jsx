function ChoiceList({
  choices,
  handleChoiceClick,
  selectedAnswer,
  correctAnswer,
}) {
  const mapIndicesToChoice = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
  };

  return (
    <div className="choices-container">
      {choices.map((choice, index) => {
        // Determine button style
        let className = "choice-button";
        if (selectedAnswer) {
          // Highlight correct and incorrect answers
          if (choice === selectedAnswer) {
            className +=
              choice === correctAnswer
                ? " correct-choice"
                : " incorrect-choice";
          }
          // Highlight only the user's choice if it is the same as the answer
          else if (choice === correctAnswer) {
            className += " correct-choice";
          }
        }
        return (
          <button
            key={index}
            className={className}
            onClick={() => handleChoiceClick(choice)}
            disabled={!!selectedAnswer}
          >
            {mapIndicesToChoice[index]}. {choice}
          </button>
        );
      })}
    </div>
  );
}

export default ChoiceList;
