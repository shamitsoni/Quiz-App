import Quiz from "./Quiz";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ReviewQuiz({ user }) {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    fetch(`/api/completed-quizzes/${user.id}/${quizId}`)
      .then((res) => res.json())
      .then((data) => setQuizData(data));
  }, [user.id, quizId]);

  if (!quizData) return <div>Loading...</div>;

  return <Quiz reviewMode={true} quizData={quizData} user={user} />;
}

export default ReviewQuiz;
