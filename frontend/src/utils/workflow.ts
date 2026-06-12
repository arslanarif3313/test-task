import type { WorkflowPhase } from "../types";

export const PHASE_ORDER: WorkflowPhase[] = [
  "to_do",
  "pending",
  "in_progress",
  "done",
];

export const PHASE_LABELS: Record<WorkflowPhase, string> = {
  to_do: "Backlog",
  pending: "Queued",
  in_progress: "Active",
  done: "Shipped",
};

export const resolveNextPhase = (current: WorkflowPhase): WorkflowPhase | null => {
  const idx = PHASE_ORDER.indexOf(current);
  if (idx === -1 || idx === PHASE_ORDER.length - 1) {
    return null;
  }
  return PHASE_ORDER[idx + 1];
};

export const formatWhen = (iso: string): string =>
  new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const profileInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
