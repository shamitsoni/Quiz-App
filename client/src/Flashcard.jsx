function Flashcard(props) {
  return (
    <div
      key={props.index}
      style={{
        backgroundColor: "#54c670ff",
        width: "50%",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: "1.5rem" }}>{props.question}</p>
      <p style={{ fontSize: "1rem" }}>{props.answer}</p>
      <br />
    </div>
  );
}

export default Flashcard;
