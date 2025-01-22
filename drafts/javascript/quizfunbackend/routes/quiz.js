const express = require("express");
const axios = require("axios");
const auth = require("./auth");
const router = express.Router();
const User = require('../User')

router.get("/questions", auth, async (req, res) => {
  try {
    const response = await axios.get(
      "https://v2.jokeapi.dev/joke/Any?type=twopart&amount=15"
    );
    const questions = response.data.jokes.map((joke) => ({
      question: joke.setup,
      answer: joke.delivery,
    }));
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/save-score", auth, async (req, res) => {
  try {
    const { score } = req.body;
    const user = await User.findById(req.userId);
    user.scores.push({ score, date: new Date() });
    await user.save();
    res.json({ message: "Score saved" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
