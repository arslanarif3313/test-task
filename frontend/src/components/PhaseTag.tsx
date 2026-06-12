import type { WorkflowPhase } from "../types";
import { PHASE_LABELS } from "../utils/workflow";

type PhaseTagProps = {
  phase: WorkflowPhase;
};

export function PhaseTag({ phase }: PhaseTagProps) {
  return <span className={`phase-tag phase-${phase}`}>{PHASE_LABELS[phase]}</span>;
}
