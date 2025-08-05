import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [array, setArray] = useState([]);
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:5000/api");
    setArray(response.data.questions);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
      {array.map((data, index) => {
        return (
          <div key={index}>
            <p>Q: {data.question}</p>
            <p>A: {data.answer}</p>
            <br />
          </div>
        );
      })}
    </>
  );
}

export default App;
