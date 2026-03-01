import pool from "../db/connection.mjs";

export async function createChallenge(title, description) {
  const result = await pool.query(
    "INSERT INTO challenges (title, description) VALUES ($1, $2) RETURNING *",
    [title, description],
  );
  return result.rows[0];
}

export async function getAllChallenges() {
  const result = await pool.query(
    "SELECT * FROM challenges WHERE deleted_at IS NULL",
  );
  return result.rows;
}

export async function updateChallenge(id, title, description) {
  const result = await pool.query(
    "UPDATE challenges SET title = $1, description = $2 WHERE id = $3 RETURNING *",
    [title, description, id],
  );
  return result.rows[0];
}

export async function completeChallenge(id) {
  const result = await pool.query(
    "UPDATE challenges SET completed = TRUE WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
}

export async function deleteChallenge(id) {
  await pool.query("UPDATE challenges SET deleted_at = NOW() WHERE id = $1", [
    id,
  ]);
}
