import { useState, useEffect } from "react";
import axios from "axios";
import Flashcard from "./Flashcard";

function App() {
  const [array, setArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Make call to the trivia API and note any errors
  const fetchAPI = async () => {
    try {
      setLoading(true);
      setError(null);

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
      if (err.response?.status === 429) {
        setError(
          "Rate limit exceeded! Please wait a few seconds before trying again."
        );
      } else if (!err.response) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("Failed to load questions. Please try again.");
      }
      console.log(err);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "1.2rem",
        }}
      >
        Loading Questions...
      </div>
    );
  } else if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #e57373",
            marginBottom: "20px",
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>Error Loading Questions...</h3>
          <p style={{ margin: "0" }}>{error}</p>
        </div>
        <button
          onClick={fetchAPI}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Try Again
        </button>
      </div>
    );
  } else {
    return (
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
}

export default App;
