import { TaskStatus } from "../models/Task";

const PHASE_SEQUENCE: TaskStatus[] = ["to_do", "pending", "in_progress", "done"];

export const canAdvancePhase = (current: TaskStatus, next: TaskStatus) => {
  return PHASE_SEQUENCE.indexOf(next) === PHASE_SEQUENCE.indexOf(current) + 1;
};
