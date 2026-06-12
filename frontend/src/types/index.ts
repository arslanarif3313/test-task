export type WorkflowPhase = "to_do" | "pending" | "in_progress" | "done";

export interface WorkItem {
  id: string;
  title: string;
  status: WorkflowPhase;
  createdAt: string;
}

export interface HistoryEntry {
  id: string;
  taskId: string;
  actor: string;
  fromStatus: WorkflowPhase;
  toStatus: WorkflowPhase;
  timestamp: string;
}
