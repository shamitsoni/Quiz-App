import "./App.css";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Flashcard from "./Flashcard";

function App() {
  const [array, setArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState({});

  let curr = array[currentIndex];

  // Make call to the trivia API and note any errors
  const fetchAPI = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        "https://opentdb.com/api.php?amount=10&type=multiple"
      );

      const questions = response.data.results.map((ques, index) => {
        // Retrieve all answer choices
        const answerChoices = [
          ques.correct_answer,
          ...ques.incorrect_answers,
        ].map((answer) => decodeHTML(answer));

        // Shuffle answer choices
        const shuffledChoices = answerChoices.sort(() => Math.random() - 0.5);

        return {
          id: index + 1,
          question: decodeHTML(ques.question),
          answer: decodeHTML(ques.correct_answer),
          choices: shuffledChoices,
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
      const next = prevIndex + 1 >= array.length ? 0 : prevIndex + 1;
      setSelectedAnswer(answered[next] || null);
      setShowResult(!!answered[next]);
      setShowAnswer(!!answered[next]);
      return next;
    });
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) => {
      const prev = prevIndex - 1 < 0 ? array.length - 1 : prevIndex - 1;
      setSelectedAnswer(answered[prev] || null);
      setShowResult(!!answered[prev]);
      setShowAnswer(!!answered[prev]);
      return prev;
    });
  };

  const handleChoiceClick = (choice) => {
    if (selectedAnswer || answered[currentIndex]) {
      return;
    }

    setSelectedAnswer(choice);
    setShowResult(true);
    setShowAnswer(true);

    setAnswered((prev) => ({ ...prev, [currentIndex]: choice }));

    if (choice === array[currentIndex].answer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (selectedAnswer || answered[currentIndex]) {
        return;
      }

      const pressedKey = event.key.toLowerCase();
      const keyMap = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
      };

      if (pressedKey in keyMap && curr.choices[keyMap[pressedKey]]) {
        handleChoiceClick(curr.choices[keyMap[pressedKey]]);
      }
    },
    [curr, selectedAnswer, answered, currentIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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
      <div className="question-display">
        Question {currentIndex + 1}/{array.length}
      </div>
      <div className="score-display">Score: {score}</div>
      {showResult && (
        <h1>
          {selectedAnswer === curr.answer
            ? "Correct!"
            : "Incorrect! Correct answer was:"}
        </h1>
      )}

      <Flashcard
        index={currentIndex}
        question={curr.question}
        answer={curr.answer}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
      />

      {curr.choices.map((choice, index) => {
        const mapIndicesToChoices = {
          0: "a",
          1: "b",
          2: "c",
          3: "d",
        };

        return (
          <button
            key={index}
            className="choice-button"
            onClick={() => handleChoiceClick(choice)}
          >
            {mapIndicesToChoices[index]}. {choice}
          </button>
        );
      })}

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
