import express from "express";
import { validateChallenge } from "../validation-middleware/validateChallenge.mjs";

import {
  createChallenge,
  getAllChallenges,
  updateChallenge,
  completeChallenge,
  deleteChallenge,
} from "../src/repositories/challengeRepository.mjs";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  const challenges = await getAllChallenges();
  res.json(challenges);
});

// CREATE
router.post("/", validateChallenge, async (req, res) => {
  const { title, description } = req.body;

  const challenge = await createChallenge(title, description);
  res.status(201).json(challenge);
});

// UPDATE
router.put("/:id", validateChallenge, async (req, res) => {
  const { title, description } = req.body;

  const updated = await updateChallenge(req.params.id, title, description);

  if (!updated) {
    return res.status(404).json({ error: "Challenge not found" });
  }

  res.json(updated);
});

// COMPLETE
router.patch("/:id/complete", async (req, res) => {
  const updated = await completeChallenge(req.params.id);

  if (!updated) {
    return res.status(404).json({ error: "Challenge not found" });
  }

  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await deleteChallenge(req.params.id);
  res.status(204).end();
});

export default router;
