import { useState, useEffect } from "react";
import axios from "axios";
import Flashcard from "./Flashcard";

function App() {
  const [array, setArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:5000/api");
    setArray(response.data.questions);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const nextCard = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex + 1 >= array.length ? 0 : prevIndex + 1;
    });
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex - 1 < 0 ? array.length - 1 : prevIndex - 1;
    });
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
