import "./App.css";
import { useState, useEffect, useCallback } from "react";
import { useTrivia } from "./hooks/useTrivia";
import Flashcard from "./components/Flashcard";
import ChoiceList from "./components/ChoiceList";
import CompletionTable from "./components/CompletionTable";

function App() {
  const { array, loading, error, fetchAPI } = useTrivia();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState({});

  let curr = array[currentIndex];

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
      <CompletionTable questions={array} answered={answered} />
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
      <ChoiceList
        choices={curr.choices}
        handleChoiceClick={handleChoiceClick}
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
