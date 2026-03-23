import express from "express";
import { validateChallenge } from "../validation/validateChallenge.mjs";
import {
  createChallenge,
  getUserChallenges,
  completeChallenge,
  deleteChallenge,
  getAllChallenges,
} from "../src/repositories/challengeRepository.mjs";

const router = express.Router();

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

router.get("/all", async (req, res) => {
  try {
    const userId = req.query.userId;

    const challenges = await getAllChallenges(userId);

    res.json(challenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch all challenges" });
  }
});

router.post("/", validateChallenge, async (req, res) => {
  try {
    const { userId, title, challengeDate } = req.body;

    const challenge = await createChallenge(userId, title, challengeDate);

    res.status(201).json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create challenge" });
  }
});

router.patch("/:id/complete", async (req, res) => {
  try {
    const challenge = await completeChallenge(req.params.id);
    res.json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update challenge" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await deleteChallenge(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete challenge" });
  }
});

export default router;
