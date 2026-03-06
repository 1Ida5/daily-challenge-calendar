import express from "express";
import {
  createChallenge,
  getUserChallenges,
  completeChallenge,
  deleteChallenge,
} from "../src/repositories/challengeRepository.mjs";

const router = express.Router();

// GET challenges for a user
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const challenges = await getUserChallenges(userId);

    res.json(challenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch challenges" });
  }
});

// CREATE challenge
router.post("/", async (req, res) => {
  try {
    const { userId, title, challengeDate } = req.body;

    if (!userId || !title || !challengeDate) {
      return res.status(400).json({ error: "Missing data" });
    }

    const challenge = await createChallenge(userId, title, challengeDate);

    res.status(201).json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create challenge" });
  }
});

// COMPLETE challenge
router.patch("/:id/complete", async (req, res) => {
  const challenge = await completeChallenge(req.params.id);

  res.json(challenge);
});

// DELETE challenge
router.delete("/:id", async (req, res) => {
  await deleteChallenge(req.params.id);

  res.status(204).end();
});

export default router;
