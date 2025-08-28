import "./Quiz.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTrivia } from "../../hooks/useTrivia";
import ChoiceList from "./ChoiceList";
import CompletionTable from "./CompletionTable";
import SummaryScreen from "./SummaryScreen";
import NavBar from "../Home/NavBar";
import ConfirmModal from "./ConfirmModal";

function Quiz({ user, stats, setStats, quizData, reviewMode = false }) {
  const [liveScore, setLiveScore] = useState(0);
  const [liveTime, setLiveTime] = useState(0);
  const [liveAnswered, setLiveAnswered] = useState({});
  const [liveSelectedAnswer, setLiveSelectedAnswer] = useState(null);
  const { loading, error, fetchAPI, array: triviaArray } = useTrivia();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const array = reviewMode ? quizData.questions : triviaArray;
  const score = reviewMode ? quizData.score : liveScore;
  const quizTime = reviewMode ? quizData.time_spent : liveTime;
  const answered = reviewMode
    ? Object.fromEntries(
        quizData.user_answers.map(({ questionIndex, selectedAnswer }) => [
          questionIndex,
          selectedAnswer,
        ])
      )
    : liveAnswered;
  const selectedAnswer = reviewMode
    ? answered[currentIndex] || null
    : liveSelectedAnswer || null;

  let curr = array[currentIndex];
  let navigate = useNavigate();

  useEffect(() => {
    document.title = "Quiz";
  }, []);

  const nextCard = () => {
    setCurrentIndex((prevIndex) => {
      const next = prevIndex + 1 >= array.length ? 0 : prevIndex + 1;
      setLiveSelectedAnswer(answered[next] || null);
      return next;
    });
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) => {
      const prev = prevIndex - 1 < 0 ? array.length - 1 : prevIndex - 1;
      setLiveSelectedAnswer(answered[prev] || null);
      return prev;
    });
  };

  const handleChoiceClick = (choice) => {
    if (liveSelectedAnswer || answered[currentIndex]) {
      return;
    }

    setLiveSelectedAnswer(choice);

    setLiveAnswered((prev) => ({ ...prev, [currentIndex]: choice }));

    if (choice === array[currentIndex].answer) {
      setLiveScore((prevScore) => prevScore + 1);
    }
  };

  // Navigate and answer questions with keyboard
  const handleKeyDown = useCallback(
    (event) => {
      if (!liveSelectedAnswer && !liveAnswered[currentIndex]) {
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
    [curr, liveSelectedAnswer, liveAnswered, currentIndex]
  );

  // Reset all quiz states and fetch new questions
  const handlePlayAgain = () => {
    setCurrentIndex(0);
    setLiveSelectedAnswer(null);
    setLiveScore(0);
    setLiveAnswered({});
    setShowSummary(false);
    setTimerActive(true);
    setQuizCompleted(false);
    fetchAPI();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Update the quiz timer until the quiz is finished
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setLiveTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Update summary state if all questions are answered
  useEffect(() => {
    if (array.length > 0 && Object.keys(liveAnswered).length === array.length) {
      setShowSummary(true);
      setTimerActive(false);
      setQuizCompleted(true);
    }
  }, [array, liveAnswered]);

  // Once quiz has been finished -> Update stats and save game data
  useEffect(() => {
    if (quizCompleted) {
      const newStats = {
        quizzes_completed: stats.quizzes_completed + 1,
        questions_answered: stats.questions_answered + array.length,
        questions_correct: stats.questions_correct + liveScore,
        time_elapsed: stats.time_elapsed + liveTime,
      };
      setStats(newStats);

      fetch(`http://localhost:5000/api/stats/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizzesCompleted: newStats.quizzes_completed,
          questionsAnswered: newStats.questions_answered,
          questionsCorrect: newStats.questions_correct,
          timeElapsed: newStats.time_elapsed,
        }),
      });

      fetch(`http://localhost:5000/api/completed-quizzes/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: array,
          userAnswers: Object.entries(liveAnswered).map(
            ([questionIndex, selectedAnswer]) => ({
              questionIndex: Number(questionIndex),
              selectedAnswer: selectedAnswer,
            })
          ),
          score: liveScore,
          totalQuestions: array.length,
          timeSpent: liveTime,
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
          time={quizTime}
          onClose={() => setShowSummary(false)}
          playAgain={handlePlayAgain}
        />
      </div>
    );
  }

  return (
    <>
      <NavBar
        user={user}
        location={reviewMode ? "review" : "quiz"}
        onExit={() => setShowExitConfirm(true)}
        quizCompleted={quizCompleted}
      />
      {showExitConfirm && (
        <ConfirmModal
          onConfirm={() => {
            setShowExitConfirm(false);
            navigate("/dashboard");
          }}
          onCancel={() => setShowExitConfirm(false)}
        />
      )}
      <div className="app-container">
        <div className="quiz-container">
          <aside className="sidebar">
            <CompletionTable questions={array} answered={answered} />
          </aside>

          <main className="main-content">
            <div className="question-container">
              <div className="score-display">
                <span>
                  Question: {currentIndex + 1}/{array.length}
                </span>
                <span>Score: {score}</span>
                <span className="quiz-timer">
                  Time: {Math.floor(quizTime / 60)}:
                  {String(quizTime % 60).padStart(2, "0")}
                </span>
              </div>

              <div className="question-card">
                <p className="question-text">{curr.question}</p>
              </div>
              <ChoiceList
                choices={curr.choices}
                handleChoiceClick={handleChoiceClick}
                selectedAnswer={selectedAnswer}
                correctAnswer={curr.answer}
              />
            </div>

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
      </div>
    </>
  );
}

export default Quiz;
