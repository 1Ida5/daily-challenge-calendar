import pool from "../db/connection.mjs";

export async function createChallenge(userId, title, challengeDate) {
  const result = await pool.query(
    `INSERT INTO challenges (user_id, title, challenge_date)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [userId, title, challengeDate],
  );

  return result.rows[0];
}

export async function getUserChallenges(userId) {
  const result = await pool.query(
    `SELECT * FROM challenges
     WHERE user_id=$1 AND deleted_at IS NULL
     ORDER BY challenge_date`,
    [userId],
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
    "UPDATE challenges SET completed = NOT completed WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
}

export async function deleteChallenge(id) {
  await pool.query("UPDATE challenges SET deleted_at = NOW() WHERE id = $1", [
    id,
  ]);
}

export async function getAllChallenges(userId) {
  const result = await pool.query(
    "SELECT * FROM challenges WHERE user_id = $1",
    [userId],
  );
  return result.rows;
}
