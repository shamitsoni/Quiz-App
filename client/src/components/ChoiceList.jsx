function ChoiceList(props) {
  const mapIndicesToChoices = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
  };

  return props.choices.map((choice, index) => (
    <button
      key={index}
      className="choice-button"
      onClick={() => props.handleChoiceClick(choice)}
    >
      {mapIndicesToChoices[index]}. {choice}
    </button>
  ));
}

export default ChoiceList;
