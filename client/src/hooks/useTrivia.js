import { useState, useEffect } from "react";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export function useTrivia() {
  const [array, setArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to decode HTML entities from content
  const decodeHTML = (textContent) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = textContent;
    return textArea.value;
  };

  const fetchAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${SERVER_URL}/api/questions`);
      const questions = response.data.results.map((ques, index) => {
        const answerChoices = [
          ques.correct_answer,
          ...ques.incorrect_answers,
        ].map((answer) => decodeHTML(answer));
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
      } else {
        setError("Failed to load questions. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return { array, loading, error, fetchAPI };
}
