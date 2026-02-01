export function validateChallenge(req, res, next) {
  const { title, date } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({
      error: "Title is required and must be a string",
    });
  }

  if (date && isNaN(Date.parse(date))) {
    return res.status(400).json({
      error: "Date must be a valid date",
    });
  }

  next();
}
