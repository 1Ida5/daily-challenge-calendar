export async function getChallenges(userId) {
  const res = await fetch(`/api/challenges?userId=${userId}`);
  return res.json();
}

export async function getAllChallenges(userId) {
  const res = await fetch(`/api/challenges/all?userId=${userId}`);
  return res.json();
}

export async function createChallenge(data) {
  return fetch("/api/challenges", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function completeChallenge(id) {
  return fetch(`/api/challenges/${id}/complete`, { method: "PATCH" });
}

export async function deleteChallenge(id) {
  return fetch(`/api/challenges/${id}`, { method: "DELETE" });
}
