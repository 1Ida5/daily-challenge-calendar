export async function getChallenges(userId) {
  try {
    const res = await fetch(`/api/challenges?userId=${userId}`);

    if (!res.ok) throw new Error();

    const data = await res.json();

    if (!Array.isArray(data)) throw new Error();

    return data;
  } catch (err) {
    const offline = JSON.parse(localStorage.getItem("offlineChallenges")) || [];

    return offline;
  }
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
