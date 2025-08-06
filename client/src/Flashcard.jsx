function Flashcard(props) {
  return (
    <div key={props.index} style={{ backgroundColor: "#ceded2", width: "50%" }}>
      <p>Q: {props.question}</p>
      <p>A: {props.answer}</p>
      <br />
    </div>
  );
}

export default Flashcard;
