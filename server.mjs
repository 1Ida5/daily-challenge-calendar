import "dotenv/config";
import express from "express";
import { initDatabase } from "./src/db/init.mjs";

import userRouter from "./routes/users.mjs";
import challengeRouter from "./routes/challenges.mjs";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/challenges", challengeRouter);
app.use(express.static("public"));

async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
