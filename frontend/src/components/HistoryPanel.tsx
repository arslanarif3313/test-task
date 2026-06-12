import type { HistoryEntry } from "../types";
import { formatWhen, PHASE_LABELS } from "../utils/workflow";

type HistoryPanelProps = {
  itemLabel: string;
  entries: HistoryEntry[];
  loading: boolean;
  fault: string | null;
  onDismiss: () => void;
};

export function HistoryPanel({
  itemLabel,
  entries,
  loading,
  fault,
  onDismiss,
}: HistoryPanelProps) {
  return (
    <div className="overlay" onClick={onDismiss}>
      <aside className="history-panel" onClick={(e) => e.stopPropagation()}>
        <header className="panel-head">
          <div>
            <h2>Change trail</h2>
            <p className="dim">{itemLabel}</p>
          </div>
          <button type="button" className="btn-ghost" onClick={onDismiss}>
            ✕
          </button>
        </header>

        {loading && <p className="dim">Pulling history...</p>}
        {fault && <p className="fault">{fault}</p>}

        {!loading && !fault && entries.length === 0 && (
          <p className="dim">No phase changes yet.</p>
        )}

        {!loading && !fault && entries.length > 0 && (
          <ul className="timeline">
            {entries.map((entry) => (
              <li key={entry.id} className="timeline-row">
                <div className="dot" />
                <div className="timeline-body">
                  <div className="timeline-top">
                    <strong>{entry.actor}</strong>
                    <time>{formatWhen(entry.timestamp)}</time>
                  </div>
                  <p>
                    {PHASE_LABELS[entry.fromStatus]} → {PHASE_LABELS[entry.toStatus]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
