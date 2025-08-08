function Flashcard(props) {
  const handleClick = () => {
    props.setShowAnswer(!props.showAnswer);
  };

  let cardContent = props.showAnswer ? props.answer : props.question;

  return (
    <div
      key={props.index}
      onClick={handleClick}
      style={{
        backgroundColor: props.showAnswer ? "#54a4c6ff" : "#54c670ff",
        width: "50%",
        textAlign: "center",
        cursor: "pointer",
        padding: "20px",
        borderRadius: "10px",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        border: props.showAnswer
          ? "3px solid #2196F3"
          : "3px solid transparent",
      }}
      // Add click animation
      onMouseDown={(e) => {
        e.target.style.transform = "scale(0.95)";
      }}
      onMouseUp={(e) => {
        e.target.style.transform = "scale(1)";
      }}
    >
      <p
        style={{
          fontSize: "1.5rem",
          transition: "all 0.4s ease",
          color: props.showAnswer ? "#1976D2" : "#2E7D32",
        }}
      >
        {cardContent}
      </p>
    </div>
  );
}

export default Flashcard;
