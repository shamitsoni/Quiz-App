import "./App.css";
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
    return <div className="loading-container">Loading questions...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3 className="error-title">Error Loading Questions</h3>
          <p className="error-text">{error}</p>
        </div>
        <button onClick={fetchAPI} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Flashcard
        index={currentIndex}
        question={array[currentIndex].question}
        answer={array[currentIndex].answer}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
      />

      <div className="button-group">
        <button onClick={prevCard} className="btn btn-secondary">
          Previous
        </button>
        <button onClick={nextCard} className="btn btn-secondary">
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
