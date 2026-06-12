import express from "express";
import cors from "cors";
import taskRouter from "./routes/task.routes";
import { TEAM_PROFILES } from "./constants/profiles";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "API online", status: "ok" });
});

app.get("/profiles", (_req, res) => {
  res.status(200).json(TEAM_PROFILES);
});

app.get("/actors", (_req, res) => {
  res.status(200).json(TEAM_PROFILES);
});

app.use("/tasks", taskRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
