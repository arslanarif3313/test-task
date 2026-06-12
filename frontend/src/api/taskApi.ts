import type { HistoryEntry, WorkItem, WorkflowPhase } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

async function sendRequest<T>(route: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${route}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(payload.message ?? "Request failed");
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const loadItems = (): Promise<WorkItem[]> => sendRequest<WorkItem[]>("/tasks");

export const addItem = (label: string): Promise<WorkItem> =>
  sendRequest<WorkItem>("/tasks", {
    method: "POST",
    body: JSON.stringify({ title: label }),
  });

export const advancePhase = (
  itemId: string,
  phase: WorkflowPhase,
  profileName: string
): Promise<WorkItem> =>
  sendRequest<WorkItem>(`/tasks/${itemId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status: phase, actor: profileName }),
  });

export const dropItem = (itemId: string): Promise<void> =>
  sendRequest<void>(`/tasks/${itemId}`, { method: "DELETE" });

export const loadHistory = (itemId: string): Promise<HistoryEntry[]> =>
  sendRequest<HistoryEntry[]>(`/tasks/${itemId}/audit-logs`);

export const loadProfiles = (): Promise<string[]> => sendRequest<string[]>("/profiles");
