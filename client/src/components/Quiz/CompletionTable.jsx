function CompletionTable({ questions, answered }) {
  return (
    <>
      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${Object.keys(answered).length * 10}%` }}
        ></div>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ paddingRight: "30px" }}>Question</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((ques, index) => (
            <tr key={index}>
              <td>#{ques.id}</td>
              <td style={{ color: "green" }}>
                {answered[index]
                  ? answered[index] === ques.answer
                    ? "✅"
                    : "❌"
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default CompletionTable;
