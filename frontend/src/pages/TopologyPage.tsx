import React, { useState } from "react";
import { TerminalLog, LogMessage } from "../components/TerminalLog";
import { TimelineScrubber, TimelinePhase } from "../components/TimelineScrubber";

export const TopologyPage: React.FC = () => {
  const [phase, setPhase] = useState<TimelinePhase>("baseline");
  const [logs, setLogs] = useState<LogMessage[]>([
    { type: "info", content: "AEGIS Mission Control initialized. Seed topology active (54 nodes, 142 edges)." },
    { type: "thought", content: "Monitoring service mesh health probes. Baseline latency P99: 42ms." },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);

  const triggerChaos = () => {
    setPhase("fault_injected");
    setLogs((prev) => [
      ...prev,
      { type: "info", content: "Chaos fault injected on payment-service (DB Pool Exhaustion)." },
      { type: "thought", content: "Breach detected: P99 latency spiked to 3420ms. Error rate 45%." },
    ]);
  };

  const triggerHeal = () => {
    setIsStreaming(true);
    setPhase("healing_actuated");
    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        { type: "thought", content: "Dead-man health watchdog active. Probing /health endpoint..." },
        { type: "result", content: "Probe 3/3 SUCCESS (38ms). Status restored to HEALTHY." },
      ]);
      setPhase("learned_feedback");
      setIsStreaming(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-6">
      <header className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>🌐 Topology & Autonomous Mission Control (HEAL & LEARN)</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button onClick={triggerChaos} className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-xs font-semibold text-white shadow-lg transition">⚡ Inject Chaos</button>
          <button onClick={triggerHeal} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold text-white shadow-lg transition">✨ Actuate Healing</button>
        </div>
      </header>

      <TimelineScrubber currentPhase={phase} onPhaseChange={setPhase} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 min-h-[350px] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-semibold text-white">Live Microservice Topology Canvas</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">54 Nodes • 142 Edges</span>
          </div>
          <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-xs">
            [READY] All 54 microservice and infrastructure nodes healthy.
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
          <TerminalLog logs={logs} isStreaming={isStreaming} />
        </div>
      </div>
    </div>
  );
};
