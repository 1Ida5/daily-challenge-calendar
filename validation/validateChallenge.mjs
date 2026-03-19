export function validateChallenge(req, res, next) {
  const { title, challengeDate } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Invalid title" });
  }

  if (!challengeDate || isNaN(Date.parse(challengeDate))) {
    return res.status(400).json({ error: "Invalid date" });
  }

  next();
}
