import React from "react";

interface RadialGaugeProps {
  score: number;
  maxScore?: number;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({ score, maxScore = 100 }) => {
  const percent = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const strokeColor = score < 40 ? "text-emerald-500" : score < 70 ? "text-amber-500" : "text-rose-500";
  const badgeLabel = score < 40 ? "APPROVED" : score < 70 ? "WARN" : "BLOCKED";

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center w-36 h-36">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" className="text-slate-800" strokeWidth="10" stroke="currentColor" fill="transparent" />
          <circle cx="50" cy="50" r="40" className={strokeColor} strokeWidth="10" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * percent) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold font-mono text-white">{score}</span>
          <span className="text-xs uppercase font-semibold text-slate-400">/ {maxScore}</span>
        </div>
      </div>
      <div className="mt-2">
        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${score < 40 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : score < 70 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
          {badgeLabel}
        </span>
      </div>
    </div>
  );
};
