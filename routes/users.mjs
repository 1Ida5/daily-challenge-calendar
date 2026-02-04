import express from "express";
import { Users, createUser, generateID } from "../data/usersStore.mjs";

const router = express.Router();

// GET all users
router.get("/", (req, res) => {
  const usersArray = Object.values(Users).filter((user) => !user.deletedAt);

  res.json(usersArray);
});

// CREATE user
router.post("/", (req, res) => {
  const { username, acceptTos } = req.body;

  if (!acceptTos) {
    return res.status(400).json({ error: "Terms must be accepted" });
  }

  const user = createUser();
  user.id = generateID();
  user.username = username || "Anonymous";
  user.tosAcceptedAt = new Date().toISOString();

  Users[user.id] = user;

  res.status(201).json({
    id: user.id,
    username: user.username,
  });
});

// EDIT user
router.put("/:id", (req, res) => {
  const user = Users[req.params.id];

  if (!user || user.deletedAt) {
    return res.status(404).json({ error: "User not found" });
  }

  const { username } = req.body;

  if (username) {
    user.username = username;
  }

  res.json(user);
});

// DELETE user
router.delete("/:id", (req, res) => {
  const user = Users[req.params.id];

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.deletedAt = new Date().toISOString();
  res.status(204).end();
});

export default router;
