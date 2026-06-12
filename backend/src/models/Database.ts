import { Task } from "./Task";
import { AuditLog } from "./AuditLog";

export interface Database {
    tasks: Task[];
    auditLogs: AuditLog[];
}