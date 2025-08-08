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
      }}
    >
      <p style={{ fontSize: "1.5rem" }}>{cardContent}</p>
    </div>
  );
}

export default Flashcard;
