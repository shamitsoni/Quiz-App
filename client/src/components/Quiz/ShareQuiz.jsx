import "./Quiz.css";
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
    <div className="share-quiz-container">
      <div className="share-quiz-summary">
        <h2>Quiz completed: {formattedDate} </h2>
        <div>Total Questions: {quiz.total_questions}</div>
        <div>
          Score: {quiz.score}/{quiz.total_questions}
        </div>
        <div>Time to complete: {quiz.time_spent}s</div>
      </div>

      <div className="share-quiz-questions">
        <h3>Questions: </h3>
        {questions.map((q, i) => {
          let correct = q.answer === answers[i].selectedAnswer;
          return (
            <div
              key={i}
              className={`share-quiz-question-card ${
                correct ? "correct" : "incorrect"
              }`}
            >
              {q.question}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShareQuiz;
