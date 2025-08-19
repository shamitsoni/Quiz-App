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

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
