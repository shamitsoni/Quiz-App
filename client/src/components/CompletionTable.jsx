function CompletionTable(props) {
  return (
    <>
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${Object.keys(props.answered).length * 10}%` }}
        ></div>
      </div>
      <table>
        <tr>
          <th style={{ paddingRight: "30px" }}>Question</th>
          <th>Status</th>
        </tr>

        {props.questions.map((ques, index) => (
          <tr>
            <td>#{ques.id}</td>
            <td>{props.answered[index] ? "Completed" : "-"}</td>
          </tr>
        ))}
      </table>
    </>
  );
}

export default CompletionTable;
