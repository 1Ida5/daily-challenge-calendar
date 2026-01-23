import express from "express";

const PORT = 8080;
const app = new express();

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Class!");
});

app.get("/api/challenges", (req, res) => {
  res.json([]);
});

app.post("/api/challenges", (req, res) => {
  res.status(201).json({ message: "Challenge created" });
});

app.put("/api/challenges/:id", (req, res) => {
  res.json({ message: "Challenge updated" });
});

app.patch("/api/challenges/:id/complete", (req, res) => {
  res.json({ message: "Challenge marked as completed" });
});

app.delete("/api/challenges/:id", (req, res) => {
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
