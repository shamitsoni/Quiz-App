import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Pool } from "pg";
import { default as serverlessExpress } from "@vendia/serverless-express";

dotenv.config();
const app = express();

const isLambda = process.env.IS_LAMBDA_ENV;
const corsOptions = isLambda
  ? {
      origin: [process.env.CORS_ORIGIN],
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }
  : { origin: ["http://localhost:5173", "http://localhost:3000"] };

app.use(cors(corsOptions));
app.use(express.json());

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});
const SALT_ROUNDS = 10;
const resetCodes = {};

// Retrieve questions from the OpenTDB API
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

// Register user into the DB
app.post("/api/sign-up", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await pool.query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
      [username, hashedPassword, email]
    );
    res.json({ message: "User has been registered!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register user." });
  }
});

// Check login against DB records
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    if (user.locked) {
      return res
        .status(403)
        .json({
          error: "Your account is locked. Please contact an admin to resolve.",
        });
    }

    res.json({
      message: "Login successful!",
      user: { id: user.id, username: user.username, is_admin: user.is_admin },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed." });
  }
});

// Verify email when resetting password
app.post("/api/verify-email", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Email address not found." });
    }

    // Generate 6 digit code
    const code = crypto.randomInt(100000, 999999).toString();

    // Store the code and expiration time with the user email
    resetCodes[email] = {
      code: code,
      expires: Date.now() + 2 * 60 * 1000, // Code expires in 2 minutes from creation
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Trivia App | Reset Password",
      text: `Your password reset code is: ${code}`,
    });

    return res.json({
      success: true,
      message: "One-time reset code has been sent to your inbox.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Verify code for password reset
app.post("/api/verify-code", async (req, res) => {
  const { email, code } = req.body;
  const entry = resetCodes[email];
  if (!entry) {
    return res.json({
      success: false,
      message: "No code found for this email.",
    });
  }
  if (Date.now() > entry.expires || entry.code !== code) {
    return res.json({ success: false, message: "Code is invalid or expired." });
  }
  delete resetCodes[email];
  res.json({
    success: true,
    message: "Code has been verified. Proceed to password reset.",
  });
});

// Reset password
app.post("/api/reset-password", async (req, res) => {
  const { email, password, passwordConfirm } = req.body;
  try {
    if (password !== passwordConfirm) {
      return res.status(401).json({ error: "Passwords must match." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedPassword, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Email not found." });
    }

    res.json({ message: "Password successfully changed." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Password reset failed." });
  }
});

// Retrieve stats by user ID
app.get("/api/stats/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      "SELECT quizzes_completed, questions_answered, questions_correct, time_elapsed FROM stats WHERE user_id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      // If no stats exist, create a row for this user
      await pool.query(
        "INSERT INTO stats (user_id, quizzes_completed, questions_answered, questions_correct, time_elapsed) VALUES ($1, 0, 0, 0, 0)",
        [userId]
      );
      return res.json({
        quizzes_completed: 0,
        questions_answered: 0,
        questions_correct: 0,
        time_elapsed: 0,
      });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});

// Update stats by user ID
app.post("/api/stats/:userId", async (req, res) => {
  const { userId } = req.params;
  const { quizzesCompleted, questionsAnswered, questionsCorrect, timeElapsed } =
    req.body;
  try {
    await pool.query(
      "UPDATE stats SET quizzes_completed = $1, questions_answered = $2, questions_correct = $3, time_elapsed = $4 WHERE user_id = $5",
      [
        quizzesCompleted,
        questionsAnswered,
        questionsCorrect,
        timeElapsed,
        userId,
      ]
    );
    res.json({ message: "Stats updated!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update stats." });
  }
});

// Get recent quizzes by user ID
app.get("/api/completed-quizzes/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, questions, user_answers, score, total_questions, time_spent, date_completed
       FROM completed_quizzes
       WHERE user_id = $1
       ORDER BY date_completed DESC
       LIMIT 10`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch completed quizzes." });
  }
});

// Save a quiz for a specific user
app.post("/api/completed-quizzes/:userId", async (req, res) => {
  const { userId } = req.params;
  const { questions, userAnswers, score, totalQuestions, timeSpent } = req.body;
  try {
    await pool.query(
      `INSERT INTO completed_quizzes 
        (user_id, questions, user_answers, score, total_questions, time_spent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        JSON.stringify(questions),
        JSON.stringify(userAnswers),
        score,
        totalQuestions,
        timeSpent,
      ]
    );
    res.json({ message: "Stats updated!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update stats." });
  }
});

app.get("/api/completed-quizzes/:userId/:quizId", async (req, res) => {
  const { userId, quizId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM completed_quizzes WHERE user_id = $1 AND id = $2`,
      [userId, quizId]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Quiz was not found under your account." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch quiz." });
  }
});

// ADMIN endpoints !

// Middleware to check for admin access
async function requireAdmin(req, res, next) {
  // Require a user id to check against
  const userId = req.headers["x-user-id"];
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: No user ID provided" });
  }
  try {
    const result = await pool.query(
      "SELECT is_admin FROM users WHERE id = $1",
      [userId]
    );
    if (!result.rows[0].is_admin) {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

// List all registered users
app.get("/api/admin/users", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username from users");
    return res.json(result.rows);
  } catch (err) {
    res.json({
      error: "Error...",
    });
  }
});

// Retrieve a specific user by ID
app.get("/api/admin/users/:userId", requireAdmin, async (req, res) => {
  const { userId } = req.params;
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  res.json(result.rows[0]);
});

// Lock a user, preventing them from logging in
app.post("/api/admin/users/:userId/lock", requireAdmin, async (req, res) => {
  const { userId } = req.params;
  await pool.query("UPDATE users SET locked = TRUE WHERE id = $1", [userId]);
  res.json({ message: "User has been locked." });
});

// Unlock a user, allowing them to log in
app.post("/api/admin/users/:userId/unlock", requireAdmin, async (req, res) => {
  const { userId } = req.params;
  await pool.query("UPDATE users SET locked = FALSE WHERE id = $1", [userId]);
  res.json({ message: "User has been unlocked." });
});

// Handle unrecognized routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

let handler;

if (isLambda) {
  handler = serverlessExpress({ app });
} else {
  const port = 5000;
  app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
}

export { handler };
