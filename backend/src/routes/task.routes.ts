import { Router } from "express";
import { isKnownProfile } from "../constants/profiles";
import { TaskStatus } from "../models/Task";
import {
  addNewItem,
  fetchAllItems,
  fetchHistoryByItem,
  ItemMissingError,
  removeItem,
  StepNotAllowedError,
  shiftItemPhase,
} from "../services/task.service";

const router = Router();

const ALLOWED_PHASES: TaskStatus[] = ["to_do", "pending", "in_progress", "done"];

const isValidPhase = (value: string): value is TaskStatus =>
  ALLOWED_PHASES.includes(value as TaskStatus);

router.get("/", (_req, res) => {
  res.status(200).json(fetchAllItems());
});

router.post("/", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const item = addNewItem(title);
  res.status(201).json(item);
});

router.put("/:id/status", (req, res) => {
  const { status, actor } = req.body;

  if (!status || !isValidPhase(status)) {
    return res.status(400).json({ message: "Valid status is required" });
  }

  if (!actor || typeof actor !== "string" || !isKnownProfile(actor)) {
    return res.status(400).json({ message: "Valid profile is required" });
  }

  try {
    const item = shiftItemPhase(req.params.id, status, actor);
    res.status(200).json(item);
  } catch (error) {
    if (error instanceof ItemMissingError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof StepNotAllowedError) {
      return res.status(400).json({ message: error.message });
    }
    throw error;
  }
});

router.get("/:id/audit-logs", (req, res) => {
  try {
    const history = fetchHistoryByItem(req.params.id);
    res.status(200).json(history);
  } catch (error) {
    if (error instanceof ItemMissingError) {
      return res.status(404).json({ message: error.message });
    }
    throw error;
  }
});

router.delete("/:id", (req, res) => {
  try {
    removeItem(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof ItemMissingError) {
      return res.status(404).json({ message: error.message });
    }
    throw error;
  }
});

export default router;
