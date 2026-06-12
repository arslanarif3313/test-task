import { TaskStatus } from "./Task";

export interface AuditLog {
    id: string,
    taskId: string,
    actor: string,
    fromStatus: TaskStatus,
    toStatus: TaskStatus,
    timestamp: string
}