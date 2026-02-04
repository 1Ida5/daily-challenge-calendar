import express from "express";
import { validateChallenge } from "../validation-middleware/validateChallenge.mjs";

const router = express.Router();

router.get("/", (req, res) => {
  res.json([]);
});

router.post("/", validateChallenge, (req, res) => {
  res.status(201).json({ message: "Challenge created" });
});

router.put("/:id", validateChallenge, (req, res) => {
  res.json({ message: "Challenge updated" });
});

router.patch("/:id/complete", (req, res) => {
  res.json({ message: "Challenge marked as completed" });
});

router.delete("/:id", (req, res) => {
  res.status(204).end();
});

export default router;
