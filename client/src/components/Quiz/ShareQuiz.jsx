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

  return (
    <>
      <div>{quiz.id}</div>
      <div>{quiz.score}</div>
    </>
  );
}

export default ShareQuiz;
