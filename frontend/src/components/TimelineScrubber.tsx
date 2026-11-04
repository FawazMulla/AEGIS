import React from "react";

export type TimelinePhase = "baseline" | "fault_injected" | "healing_actuated" | "learned_feedback";

interface TimelineScrubberProps {
  currentPhase: TimelinePhase;
  onPhaseChange: (phase: TimelinePhase) => void;
}

const PHASES: { id: TimelinePhase; label: string; color: string }[] = [
  { id: "baseline", label: "1. Baseline", color: "bg-emerald-500" },
  { id: "fault_injected", label: "2. Fault Injected", color: "bg-rose-500" },
  { id: "healing_actuated", label: "3. Healing Actuated", color: "bg-amber-500" },
  { id: "learned_feedback", label: "4. Learned & Feedback", color: "bg-indigo-500" },
];

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({ currentPhase, onPhaseChange }) => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400">Incident Lifecycle Timeline</span>
        <span className="text-xs font-mono font-bold text-white uppercase">{currentPhase.replace("_", " ")}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {PHASES.map((p) => {
          const isActive = currentPhase === p.id;
          return (
            <button key={p.id} onClick={() => onPhaseChange(p.id)} className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition flex items-center gap-2 ${isActive ? `${p.color} text-white border-transparent shadow-lg font-bold` : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"}`}>
              <span className={`w-2 h-2 rounded-full ${isActive ? "bg-white" : p.color}`} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
