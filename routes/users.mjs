import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../src/repositories/userRepository.mjs";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
});

// CREATE user
router.post("/", async (req, res) => {
  const { username, acceptTos } = req.body;

  if (!acceptTos) {
    return res.status(400).json({ error: "Terms must be accepted" });
  }

  try {
    const user = await createUser(username || "Anonymous");
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "User could not be created" });
  }
});

// EDIT user
router.put("/:id", async (req, res) => {
  const { username } = req.body;

  const updated = await updateUser(req.params.id, username);

  if (!updated) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(updated);
});

// DELETE user
router.delete("/:id", async (req, res) => {
  await deleteUser(req.params.id);
  res.status(204).end();
});

export default router;
