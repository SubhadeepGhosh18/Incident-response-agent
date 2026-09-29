import React, { useState } from 'react';
import { Terminal, Copy, Check, Trash2, ArrowRight } from 'lucide-react';
import { ExecutionLogEntry } from '../types/incident';

interface ExecutionTerminalProps {
  logs: ExecutionLogEntry[];
  onClear: () => void;
}

export const ExecutionTerminal: React.FC<ExecutionTerminalProps> = ({ logs, onClear }) => {
  const [copied, setCopied] = useState(false);

  const copyAll = () => {
    const text = logs.map(l => `[${l.timestamp}] $ ${l.command}\n${l.output}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-3.5 font-mono text-xs sm:text-sm transition-colors">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
            <Terminal className="w-4 h-4 text-slate-800 dark:text-slate-200" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-900 dark:text-white tracking-wider text-xs sm:text-sm uppercase block truncate">
              Live Action Execution Terminal
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans truncate block">
              Real-time stdout / stderr stream for dispatched remediation commands
            </span>
          </div>
          <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 font-mono shrink-0">
            GKE PROD
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {logs.length > 0 && (
            <>
              <button
                onClick={copyAll}
                className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors font-semibold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={onClear}
                className="text-xs text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-900 flex items-center gap-1.5 transition-colors font-semibold cursor-pointer"
                title="Clear terminal output"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-slate-950 rounded-xl border border-slate-800/90 p-3.5 sm:p-4 min-h-[140px] max-h-[300px] overflow-y-auto space-y-3 text-slate-200 shadow-inner">
        {logs.length === 0 ? (
          <div className="text-slate-500 text-xs py-8 text-center font-sans">
            No mutating commands executed yet. Select an Action Plan step or review the Human Approval Gate to dispatch remediation CLI.
          </div>
        ) : (
          logs.map((entry, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="text-slate-500 font-mono text-[11px]">[{new Date(entry.timestamp).toLocaleTimeString()}]</span>
                <span className="text-emerald-400 font-bold">$</span>
                <span className="text-slate-100 font-semibold font-mono break-all">{entry.command}</span>
              </div>
              <pre className={`text-xs p-2.5 rounded-lg whitespace-pre-wrap leading-relaxed font-mono break-all overflow-x-auto ${
                entry.type === 'stderr' ? 'bg-rose-950/40 text-rose-300 border border-rose-900/40' :
                entry.type === 'warn' ? 'bg-amber-950/40 text-amber-300 border border-amber-900/40' :
                entry.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/40' :
                'bg-slate-900/90 text-slate-300 border border-slate-800'
              }`}>
                {entry.output}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

