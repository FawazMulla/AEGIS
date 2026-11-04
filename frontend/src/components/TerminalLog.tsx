import React from "react";

export interface LogMessage {
  type: "thought" | "cypher" | "candidates" | "result" | "done" | "info";
  content: any;
}

interface TerminalLogProps {
  logs: LogMessage[];
  isStreaming?: boolean;
}

export const TerminalLog: React.FC<TerminalLogProps> = ({ logs, isStreaming = false }) => {
  return (
    <div className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs overflow-y-auto shadow-inner">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
        <span className="text-slate-400 font-semibold flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Autonomous SRE Diagnostic Stream
        </span>
        {isStreaming && <span className="text-emerald-400 text-[10px] animate-pulse">STREAMING...</span>}
      </div>
      <div className="space-y-1.5">
        {logs.map((log, idx) => {
          let color = "text-slate-300";
          let prefix = "[INFO]";
          if (log.type === "thought") { color = "text-cyan-400"; prefix = "[THOUGHT]"; }
          else if (log.type === "cypher") { color = "text-amber-400"; prefix = "[CYPHER]"; }
          else if (log.type === "candidates") { color = "text-indigo-400"; prefix = "[PLAN]"; }
          else if (log.type === "result") { color = "text-emerald-400"; prefix = "[RESULT]"; }

          const rendered = typeof log.content === "string" ? log.content : JSON.stringify(log.content, null, 2);
          return (
            <div key={idx} className="leading-relaxed">
              <span className={`font-semibold mr-1.5 ${color}`}>{prefix}</span>
              <span className="text-slate-300 whitespace-pre-wrap">{rendered}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
