import React, { useState } from "react";
import { RadialGauge } from "../components/RadialGauge";
import { GitHubRepoSelectorModal } from "../components/GitHubRepoSelectorModal";

export const PredictPage: React.FC = () => {
  const [selectedPR, setSelectedPR] = useState("PR-142");
  const [riskScore, setRiskScore] = useState(86);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRepo, setActiveRepo] = useState("spring-petclinic/spring-petclinic-microservices");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>🛡️ Pre-Ship Simulation (PREDICT)</span>
            </h1>
            <p className="text-sm text-slate-400">Autonomous Change-Risk Governance, AST contract diffs, and blast radius impact.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-lg text-xs font-semibold transition">
            Repo: {activeRepo.split("/")[1] || activeRepo}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Composite Change Risk</h3>
            <RadialGauge score={riskScore} />
            <div className="text-xs text-center text-slate-400 mt-2">Formula: 0.35·Blast + 0.30·Contract + 0.15·Cycle + 0.20·History</div>
          </div>
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-400">Target Pull Request</h3>
              <select value={selectedPR} onChange={(e) => { setSelectedPR(e.target.value); setRiskScore(e.target.value === "PR-142" ? 86 : 28); }} className="bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs">
                <option value="PR-142">PR #142: Drop telephone field from Owner.java (Breaking)</option>
                <option value="PR-143">PR #143: Add optional notes field (Safe Additive)</option>
              </select>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs">
              <div className="text-rose-400 mb-1">--- a/src/main/java/org/springframework/samples/petclinic/owner/Owner.java</div>
              <div className="text-emerald-400 mb-1">+++ b/src/main/java/org/springframework/samples/petclinic/owner/Owner.java</div>
              <div className="text-rose-500 bg-rose-950/30 px-1 py-0.5 rounded">- private String telephone;</div>
              <div className="text-emerald-500 bg-emerald-950/30 px-1 py-0.5 rounded">+ private String notes;</div>
            </div>
          </div>
        </div>
      </div>
      <GitHubRepoSelectorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={(r) => setActiveRepo(r)} />
    </div>
  );
};
