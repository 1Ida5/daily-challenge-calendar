import express from "express";
import userRouter from "./routes/users.mjs";
import challengeRouter from "./routes/challenges.mjs";

const PORT = 8080;
const app = express();

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/challenges", challengeRouter);

app.use(express.static("Public"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
