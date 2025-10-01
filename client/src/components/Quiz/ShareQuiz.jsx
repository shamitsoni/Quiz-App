import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function ShareQuiz() {
  const { shareId } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/shared/${shareId}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data));
  }, []);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const date = new Date(quiz.date_completed);
  const formattedDate = date.toLocaleDateString();
  const questions = quiz.questions;
  const answers = quiz.user_answers;

  return (
    <>
      <div>Quiz completed: {formattedDate} </div>
      <div>Total Questions: {quiz.total_questions}</div>
      <div>
        Score: {quiz.score}/{quiz.total_questions}
      </div>
      <div>Time to complete: {quiz.time_spent}s</div>
      <br />
      <div>Questions:</div>
      {questions.map((q, i) => {
        return (
          <div key={i}>
            {q.answer === answers[i].selectedAnswer ? "✅" : "❌"}
            {q.question}
          </div>
        );
      })}
    </>
  );
}

export default ShareQuiz;
