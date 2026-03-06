import express from "express";
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  loginUser,
} from "../src/repositories/userRepository.mjs";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username } = req.body;
    const passwordHash = req.securePassword;

    if (!username || !passwordHash) {
      return res.status(400).json({
        error: "Username and password required",
      });
    }

    const user = await loginUser(username, passwordHash);

    delete user.password;

    res.json(user);
  } catch (err) {
    if (err.message === "Invalid password") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (err.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }

    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();

    const safeUsers = users.map((user) => {
      delete user.password;
      return user;
    });

    res.json(safeUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch users" });
  }
});

// CREATE USER
router.post("/", async (req, res) => {
  try {
    const { username, acceptTos } = req.body;
    const passwordHash = req.securePassword;

    if (!acceptTos) {
      return res.status(400).json({
        error: "Terms must be accepted",
      });
    }

    if (!username || !passwordHash) {
      return res.status(400).json({
        error: "Username and password required",
      });
    }

    const user = await createUser(username, passwordHash);

    delete user.password;

    res.status(201).json(user);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({
        error: "Username already exists",
      });
    }

    console.error(err);
    res.status(500).json({
      error: "User could not be created",
    });
  }
});

// UPDATE USER
router.put("/:id", async (req, res) => {
  try {
    const { username } = req.body;

    const updated = await updateUser(req.params.id, username);

    if (!updated) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    delete updated.password;

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Could not update user",
    });
  }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
  try {
    await deleteUser(req.params.id);

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Could not delete user",
    });
  }
});

export default router;
