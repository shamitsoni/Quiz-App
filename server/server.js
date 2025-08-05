import express from "express";
import cors from "cors";
import questionData from "./sample_questions.json" assert { type: "json" };

const app = express();
const port = 5000;
const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));

app.get("/api", (req, res) => {
  res.json(questionData);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
