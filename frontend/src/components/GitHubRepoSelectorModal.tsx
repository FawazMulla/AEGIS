import React, { useState } from "react";

interface GitHubRepoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (repo: string, branch: string) => void;
}

export const GitHubRepoSelectorModal: React.FC<GitHubRepoSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [repo, setRepo] = useState("spring-petclinic/spring-petclinic-microservices");
  const [branch, setBranch] = useState("main");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl text-slate-100">
        <h3 className="text-lg font-bold mb-4">Connect GitHub Repository</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Target Repository</label>
            <input type="text" value={repo} onChange={(e) => setRepo(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Target Branch</label>
            <input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition">Cancel</button>
          <button onClick={() => { onSelect(repo, branch); onClose(); }} className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition">Select Repository</button>
        </div>
      </div>
    </div>
  );
};
