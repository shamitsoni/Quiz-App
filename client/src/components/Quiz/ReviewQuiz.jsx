import Quiz from "./Quiz";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function ReviewQuiz({ user }) {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${SERVER_URL}/api/completed-quizzes/${user.id}/${quizId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setQuizData(data);
        }
      })
      .catch(() => setError("Failed to load quiz."));
  }, [user.id, quizId]);

  if (error) {
    return (
      <div>
        <h1>Review Failed</h1>
        <p>{error}</p>
        <a href="/dashboard">Go Back to Dashboard</a>
      </div>
    );
  }

  if (!quizData) {
    return <div>Loading...</div>;
  }

  return <Quiz user={user} quizData={quizData} reviewMode={true} />;
}

export default ReviewQuiz;
