import { useCallback, useEffect, useState } from "react";
import {
  addItem,
  advancePhase,
  dropItem,
  loadHistory,
  loadItems,
  loadProfiles,
} from "../api/taskApi";
import type { HistoryEntry, WorkItem } from "../types";
import { resolveNextPhase } from "../utils/workflow";
import { HistoryPanel } from "./HistoryPanel";
import { ItemCard } from "./ItemCard";
import { ProfilePicker } from "./ProfilePicker";
import { QuickAddBar } from "./QuickAddBar";

export function DashboardPage() {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [profiles, setProfiles] = useState<string[]>([]);
  const [activeProfile, setActiveProfile] = useState("");
  const [booting, setBooting] = useState(true);
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [fault, setFault] = useState<string | null>(null);
  const [historyTarget, setHistoryTarget] = useState<WorkItem | null>(null);
  const [historyRows, setHistoryRows] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyFault, setHistoryFault] = useState<string | null>(null);

  const bootstrap = useCallback(async () => {
    setBooting(true);
    setFault(null);
    try {
      const [loadedItems, loadedProfiles] = await Promise.all([
        loadItems(),
        loadProfiles(),
      ]);
      setItems(loadedItems);
      setProfiles(loadedProfiles);
      setActiveProfile(
        loadedProfiles.find((name) => name === "Arslan Arif") ?? loadedProfiles[0] ?? ""
      );
    } catch (err) {
      setFault(err instanceof Error ? err.message : "Could not load workspace");
    } finally {
      setBooting(false);
    }
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const handleAdd = async (label: string) => {
    setAdding(true);
    setFault(null);
    try {
      const created = await addItem(label);
      setItems((prev) => [created, ...prev]);
    } catch (err) {
      setFault(err instanceof Error ? err.message : "Could not add item");
    } finally {
      setAdding(false);
    }
  };

  const handleAdvance = async (itemId: string) => {
    const target = items.find((i) => i.id === itemId);
    if (!target || !activeProfile) return;

    const next = resolveNextPhase(target.status);
    if (!next) return;

    setBusyId(itemId);
    setFault(null);
    try {
      const updated = await advancePhase(itemId, next, activeProfile);
      setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
    } catch (err) {
      setFault(err instanceof Error ? err.message : "Phase update failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    setBusyId(itemId);
    setFault(null);
    try {
      await dropItem(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      setFault(err instanceof Error ? err.message : "Could not remove item");
    } finally {
      setBusyId(null);
    }
  };

  const openHistory = async (item: WorkItem) => {
    setHistoryTarget(item);
    setHistoryRows([]);
    setHistoryLoading(true);
    setHistoryFault(null);
    try {
      const rows = await loadHistory(item.id);
      setHistoryRows(rows);
    } catch (err) {
      setHistoryFault(err instanceof Error ? err.message : "History unavailable");
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">◆</span>
          <div>
            <h1>FlowDesk</h1>
            <p className="dim">Internal ops board</p>
          </div>
        </div>

        <ProfilePicker
          profiles={profiles}
          activeProfile={activeProfile}
          onPick={setActiveProfile}
        />

        <div className="sidebar-stats">
          <div className="stat-box">
            <span className="stat-num">{items.length}</span>
            <span className="dim">open items</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">
              {items.filter((i) => i.status === "done").length}
            </span>
            <span className="dim">shipped</span>
          </div>
        </div>
      </aside>

      <main className="workspace">
        <QuickAddBar onSubmit={handleAdd} busy={adding} />

        {fault && <div className="fault-banner">{fault}</div>}

        <section className="board">
          <div className="board-head">
            <h2>Work queue</h2>
            {!booting && <span className="dim">{items.length} entries</span>}
          </div>

          {booting && <p className="dim">Loading workspace...</p>}

          {!booting && items.length === 0 && (
            <div className="empty-board">
              <p>Nothing here yet — add something above.</p>
            </div>
          )}

          <div className="card-grid">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                busy={busyId === item.id}
                onAdvance={handleAdvance}
                onRemove={handleRemove}
                onShowHistory={openHistory}
              />
            ))}
          </div>
        </section>
      </main>

      {historyTarget && (
        <HistoryPanel
          itemLabel={historyTarget.title}
          entries={historyRows}
          loading={historyLoading}
          fault={historyFault}
          onDismiss={() => setHistoryTarget(null)}
        />
      )}
    </div>
  );
}
