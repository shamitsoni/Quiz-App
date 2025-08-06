function Flashcard(props) {
  const handleClick = () => {
    props.setShowAnswer(!props.showAnswer);
  };

  return (
    <div
      key={props.index}
      onClick={handleClick}
      style={{
        backgroundColor: "#54c670ff",
        width: "50%",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <p style={{ fontSize: "1.5rem" }}>{props.question}</p>
      {props.showAnswer && <p style={{ fontSize: "1rem" }}>{props.answer}</p>}
    </div>
  );
}

export default Flashcard;
