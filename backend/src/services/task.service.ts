import { v4 as uuidv4 } from "uuid";
import { AuditLog } from "../models/AuditLog";
import { Task, TaskStatus } from "../models/Task";
import { canAdvancePhase } from "../utils/statusFlow";
import { loadStore, persistStore } from "./db.service";

export class ItemMissingError extends Error {
  constructor() {
    super("Task not found");
    this.name = "ItemMissingError";
  }
}

export class StepNotAllowedError extends Error {
  constructor() {
    super("Invalid status transition");
    this.name = "StepNotAllowedError";
  }
}

export const fetchAllItems = (): Task[] => {
  const store = loadStore();
  return store.tasks;
};

export const addNewItem = (label: string): Task => {
  const store = loadStore();

  const freshItem: Task = {
    id: uuidv4(),
    title: label.trim(),
    status: "to_do",
    createdAt: new Date().toISOString(),
  };

  store.tasks.push(freshItem);
  persistStore(store);

  return freshItem;
};

export const removeItem = (itemId: string): void => {
  const store = loadStore();
  const matchIndex = store.tasks.findIndex((entry) => entry.id === itemId);

  if (matchIndex === -1) {
    throw new ItemMissingError();
  }

  store.tasks.splice(matchIndex, 1);
  persistStore(store);
};

export const shiftItemPhase = (
  itemId: string,
  targetPhase: TaskStatus,
  changedBy: string
): Task => {
  const store = loadStore();
  const matchedItem = store.tasks.find((entry) => entry.id === itemId);

  if (!matchedItem) {
    throw new ItemMissingError();
  }

  if (matchedItem.status === targetPhase) {
    return matchedItem;
  }

  if (!canAdvancePhase(matchedItem.status, targetPhase)) {
    throw new StepNotAllowedError();
  }

  const historyEntry: AuditLog = {
    id: uuidv4(),
    taskId: matchedItem.id,
    actor: changedBy,
    fromStatus: matchedItem.status,
    toStatus: targetPhase,
    timestamp: new Date().toISOString(),
  };

  store.auditLogs.push(historyEntry);
  matchedItem.status = targetPhase;
  persistStore(store);

  return matchedItem;
};

export const fetchHistoryByItem = (itemId: string): AuditLog[] => {
  const store = loadStore();
  const hasRecord =
    store.tasks.some((entry) => entry.id === itemId) ||
    store.auditLogs.some((entry) => entry.taskId === itemId);

  if (!hasRecord) {
    throw new ItemMissingError();
  }

  return store.auditLogs
    .filter((entry) => entry.taskId === itemId)
    .sort(
      (left, right) =>
        new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime()
    );
};
