import { useState, useEffect } from "react";
import axios from "axios";
import Flashcard from "./Flashcard";

function App() {
  const [array, setArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const fetchAPI = async () => {
    try {
      const response = await axios.get(
        "https://opentdb.com/api.php?amount=10&type=multiple"
      );

      const questions = response.data.results.map((ques, index) => {
        return {
          id: index + 1,
          question: decodeHTML(ques.question),
          answer: decodeHTML(ques.correct_answer),
        };
      });
      setArray(questions);
    } catch (err) {
      console.log(err);
    }
  };

  // Helper function to decode HTML entities from content
  const decodeHTML = (textContent) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = textContent;
    return textArea.value;
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const nextCard = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex + 1 >= array.length ? 0 : prevIndex + 1;
    });
    setShowAnswer(false);
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex - 1 < 0 ? array.length - 1 : prevIndex - 1;
    });
    setShowAnswer(false);
  };

  // Check whether the array has been populated before rendering components
  return array.length === 0 ? (
    <div>Loading Data...</div>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Flashcard
        index={currentIndex}
        question={array[currentIndex].question}
        answer={array[currentIndex].answer}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
      />

      <div style={{ marginTop: "20px" }}>
        <button onClick={prevCard}>Previous</button>
        <button onClick={nextCard} style={{ marginLeft: "10px" }}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
