import pool from "../db/connection.mjs";

export async function createUser(username) {
  const result = await pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
    [username, "default"],
  );
  return result.rows[0];
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
