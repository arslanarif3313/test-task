import type { WorkItem } from "../types";
import { PHASE_LABELS, resolveNextPhase } from "../utils/workflow";
import { PhaseTag } from "./PhaseTag";

type ItemCardProps = {
  item: WorkItem;
  busy: boolean;
  onAdvance: (id: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onShowHistory: (item: WorkItem) => void;
};

export function ItemCard({ item, busy, onAdvance, onRemove, onShowHistory }: ItemCardProps) {
  const upcoming = resolveNextPhase(item.status);

  return (
    <article className="item-card">
      <div className="item-head">
        <h3>{item.title}</h3>
        <PhaseTag phase={item.status} />
      </div>

      <p className="dim meta">Opened {new Date(item.createdAt).toLocaleDateString()}</p>

      <div className="phase-track">
        {(["to_do", "pending", "in_progress", "done"] as const).map((phase) => (
          <span
            key={phase}
            className={`track-step ${item.status === phase ? "current" : ""} ${
              ["to_do", "pending", "in_progress", "done"].indexOf(item.status) >
              ["to_do", "pending", "in_progress", "done"].indexOf(phase)
                ? "passed"
                : ""
            }`}
          >
            {PHASE_LABELS[phase]}
          </span>
        ))}
      </div>

      <div className="item-foot">
        {upcoming ? (
          <button type="button" disabled={busy} onClick={() => onAdvance(item.id)}>
            {busy ? "..." : `→ ${PHASE_LABELS[upcoming]}`}
          </button>
        ) : (
          <span className="dim">All phases complete</span>
        )}
        <button type="button" className="btn-ghost" onClick={() => onShowHistory(item)}>
          History
        </button>
        <button type="button" className="btn-warn" disabled={busy} onClick={() => onRemove(item.id)}>
          Remove
        </button>
      </div>
    </article>
  );
}
