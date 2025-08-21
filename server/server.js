import express from "express";
import cors from "cors";
import axios from "axios";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 5000;
const corsOptions = {
  origin: ["http://localhost:5173"],
};

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

app.use(cors(corsOptions));
app.use(express.json());

app.get("/api/questions", async (req, res) => {
  try {
    const response = await axios.get(
      "https://opentdb.com/api.php?amount=10&type=multiple"
    );
    res.json(response.data);
  } catch (err) {
    res.json({
      error: "Failed to fetch questions. Please wait and try again soon.",
    });
  }
});

app.post("/api/sign-up", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, password]
    );
    res.json({ message: "User has been registered!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register user." });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];
    if (!user || password !== user.password) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    res.json({
      message: "Login successful!",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed." });
  }
});

app.get("/api/stats/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT quizzes_completed, questions_answered, questions_correct FROM stats WHERE user_id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      // If no stats exist, create a row for this user
      await pool.query(
        "INSERT INTO stats (user_id, quizzes_completed, questions_answered, questions_correct) VALUES ($1, 0, 0, 0)",
        [userId]
      );
      return res.json({
        quizzes_completed: 0,
        questions_answered: 0,
        questions_correct: 0,
      });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});

app.post("/api/stats/:userId", async (req, res) => {
  const { userId } = req.params;
  const { quizzesCompleted, questionsAnswered, questionsCorrect } = req.body;
  try {
    await pool.query(
      "UPDATE stats SET quizzes_completed = $1, questions_answered = $2, questions_correct = $3 WHERE user_id = $4",
      [quizzesCompleted, questionsAnswered, questionsCorrect, userId]
    );
    res.json({ message: "Stats updated!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update stats." });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
