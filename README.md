# Mini Task Manager

A full-stack internal task manager built with **React + TypeScript** (frontend) and **Node.js + Express + TypeScript** (backend). Users can create tasks, advance status in a strict workflow, delete tasks, and inspect immutable audit history for every status change.

## Setup

### Prerequisites

- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI runs on `http://localhost:5173` and calls the backend at `http://localhost:5000` (configurable via `frontend/.env`).

## Architecture Overview

```
frontend/                 React + TypeScript UI
  src/
    api/client.ts         HTTP client for backend endpoints
    components/           Task list, create form, audit modal
    types/                Shared frontend types
    utils/status.ts       Status labels and next-step helper

backend/                  Express + TypeScript API
  src/
    routes/task.routes.ts HTTP handlers
    services/
      task.service.ts     Business rules and audit creation
      db.service.ts       JSON file persistence
    constants/actors.ts   Predefined actor list
    utils/statusFlow.ts   Allowed status transitions
    data/db.json          Persistent task + audit data
```

### Data flow

1. Frontend loads tasks and predefined actors.
2. Status updates are sent to the backend with an actor selected from the dropdown.
3. Backend validates the transition (`to_do → pending → in_progress → done`), writes an immutable audit log entry, and updates the task status in one write.
4. Audit logs are fetched separately and shown chronologically in a modal.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create a task (`{ "title": "..." }`) |
| PUT | `/tasks/:id/status` | Update status (`{ "status": "...", "actor": "..." }`) |
| GET | `/tasks/:id/audit-logs` | List audit logs for a task |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/profiles` | List predefined team profiles for the UI |
| GET | `/actors` | Alias of `/profiles` (backward compatible) |

## Assumptions

- This is an internal tool with no authentication.
- Status changes are attributed to one of two fixed profiles: `Faizan Shafqat` (initial version) and `Arslan Arif` (this version).
- Tasks always start in `to_do`.
- Status can only move one step forward at a time.
- JSON file persistence is sufficient for this scope.
- Deleting a task removes the task record but keeps audit logs for traceability.

## Trade-offs

| Decision | Why |
|----------|-----|
| JSON file instead of a database | Fast to implement, easy to inspect, good enough for a take-home demo |
| No auth | Explicitly out of scope; keeps focus on task flow and audit behavior |
| Append-only audit logs in the same JSON store | Simple consistency model without introducing a separate audit service |
| Single actor dropdown shared across tasks | Keeps UI simple; actor selection is required before advancing status |
| Idempotent status updates return `200` without new audit entry | Prevents duplicate logs when the same status is submitted again |

## What Would Be Improved With More Time

- Replace JSON file storage with PostgreSQL and transactional writes
- Add automated tests for status flow, idempotency, and audit immutability
- Add optimistic UI updates with rollback on failure
- Add pagination/filtering for large task lists
- Add server-side locking or queueing for concurrent writes
- Extract shared types into a common package used by both frontend and backend

## Deliverable Questions

### How do you ensure audit logs cannot be modified?

Audit logs are **append-only** in the backend:

- There is no API route to update or delete audit logs.
- Logs are only created inside `updateTaskStatus()` when a valid transition occurs.
- The service never exposes write access to existing log entries.

In a production system, this would be strengthened with database constraints (no `UPDATE`/`DELETE` permissions on the audit table), event sourcing, or writing audit records to a separate immutable store.

### Which part is most risky at scale?

**Concurrent writes to the JSON file** are the biggest risk. The current read-modify-write pattern is not safe under parallel requests and will not scale. At higher load, this becomes a data consistency and corruption risk before anything else.

### What would you refactor first in a larger system and why?

I would refactor **persistence and write consistency** first:

1. Move tasks and audit logs into a real database.
2. Wrap status updates and audit creation in a single transaction.
3. Add proper concurrency control.

That refactor directly protects the most important business rule: task status and audit history must always stay consistent.

### If AI was used, explain what AI helped with and how you validated it.

AI was used to accelerate scaffolding and implementation while the design decisions were reviewed manually.

AI helped with:

- Bootstrapping the React frontend structure
- Drafting service/route boilerplate
- Writing the README structure

Validation approach:

- Ran the backend and frontend locally
- Verified each required API endpoint manually
- Confirmed invalid transitions are rejected
- Confirmed repeated status updates do not create duplicate audit logs
- Confirmed audit logs display in chronological order in the UI

## Project Structure

```
Take-Home Task/
├── backend/
├── frontend/
└── README.md
```
