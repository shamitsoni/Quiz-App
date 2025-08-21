import "./Quiz.css";
import { useState, useEffect, useCallback } from "react";
import { useTrivia } from "../hooks/useTrivia";
import ChoiceList from "./ChoiceList";
import CompletionTable from "./CompletionTable";
import SummaryScreen from "./SummaryScreen";

function Quiz({ user, stats, setStats }) {
  const { array, loading, error, fetchAPI } = useTrivia();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  let curr = array[currentIndex];

  const nextCard = () => {
    setCurrentIndex((prevIndex) => {
      const next = prevIndex + 1 >= array.length ? 0 : prevIndex + 1;
      setSelectedAnswer(answered[next] || null);
      return next;
    });
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) => {
      const prev = prevIndex - 1 < 0 ? array.length - 1 : prevIndex - 1;
      setSelectedAnswer(answered[prev] || null);
      return prev;
    });
  };

  const handleChoiceClick = (choice) => {
    if (selectedAnswer || answered[currentIndex]) {
      return;
    }

    setSelectedAnswer(choice);

    setAnswered((prev) => ({ ...prev, [currentIndex]: choice }));

    if (choice === array[currentIndex].answer) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  // Navigate and answer questions with keyboard
  const handleKeyDown = useCallback(
    (event) => {
      if (!selectedAnswer && !answered[currentIndex]) {
        const pressedKey = event.key.toLowerCase();
        const keyMap = { a: 0, b: 1, c: 2, d: 3 };
        if (pressedKey in keyMap && curr.choices[keyMap[pressedKey]]) {
          handleChoiceClick(curr.choices[keyMap[pressedKey]]);
          return;
        }
      }

      if (event.key === "ArrowRight") {
        nextCard();
      } else if (event.key === "ArrowLeft") {
        prevCard();
      }
    },
    [curr, selectedAnswer, answered, currentIndex]
  );

  // Reset all quiz states and fetch new questions
  const handlePlayAgain = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswered({});
    setShowSummary(false);
    setQuizCompleted(false);
    fetchAPI();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Update summary state if all questions are answered
  useEffect(() => {
    if (array.length > 0 && Object.keys(answered).length === array.length) {
      setShowSummary(true);
      setQuizCompleted(true);
    }
  }, [array, answered]);

  useEffect(() => {
    if (quizCompleted) {
      const newStats = {
        quizzes_completed: stats.quizzes_completed + 1,
        questions_answered: stats.questions_answered + array.length,
        questions_correct: stats.questions_correct + score,
      };
      setStats(newStats);

      fetch(`http://localhost:5000/api/stats/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizzesCompleted: newStats.quizzes_completed,
          questionsAnswered: newStats.questions_answered,
          questionsCorrect: newStats.questions_correct,
        }),
      });
    }
  }, [quizCompleted]);

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

  if (showSummary) {
    return (
      <div className="modal-overlay">
        <SummaryScreen
          questions={array}
          answered={Object.values(answered)}
          onClose={() => setShowSummary(false)}
          playAgain={handlePlayAgain}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <CompletionTable questions={array} answered={answered} />
      </aside>

      <main className="main-content">
        <div className="question-score-display">
          <span>
            Question: {currentIndex + 1}/{array.length}
          </span>
          <span>Score: {score}</span>
        </div>

        <div className="card">
          <p className="card-text">{curr.question}</p>
        </div>
        <ChoiceList
          choices={curr.choices}
          handleChoiceClick={handleChoiceClick}
          selectedAnswer={selectedAnswer}
          correctAnswer={curr.answer}
        />
        <div className="button-group">
          <button className="btn btn-secondary" onClick={prevCard}>
            Previous
          </button>
          <button className="btn btn-secondary" onClick={nextCard}>
            Next
          </button>
        </div>
        {Object.keys(answered).length === array.length && (
          <button
            className="btn btn-secondary"
            id="review-button"
            onClick={() => setShowSummary(true)}
          >
            Review Summary
          </button>
        )}
      </main>
    </div>
  );
}

export default Quiz;
