import pool from "../db/connection.mjs";

export async function createUser(username, passwordHash) {
  const result = await pool.query(
    "INSERT INTO users (username, password) VALUES ($1,$2) RETURNING *",
    [username, passwordHash],
  );

  const user = result.rows[0];

  delete user.password;

  return user;
}

export async function getAllUsers() {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
}

export async function getUserById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

export async function updateUser(id, username) {
  const result = await pool.query(
    "UPDATE users SET username = $1 WHERE id = $2 RETURNING *",
    [username, id],
  );
  return result.rows[0];
}

export async function deleteUser(id) {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
}

export async function findUserByUsername(username) {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
}

export async function loginUser(username, passwordHash) {
  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.password !== passwordHash) {
    throw new Error("Invalid password");
  }

  delete user.password;

  return user;
}
