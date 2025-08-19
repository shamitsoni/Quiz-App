import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const port = 5000;
const corsOptions = {
  origin: ["http://localhost:5173"],
};

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
  res.json({ message: `User: ${username} registered!` });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
