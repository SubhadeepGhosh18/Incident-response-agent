import React, { useState } from 'react';
import { ActionPlanStep } from '../types/incident';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Terminal, 
  Check, 
  X, 
  Lock, 
  Copy, 
  ArrowRight,
  Flame,
  AlertOctagon
} from 'lucide-react';

interface HumanApprovalModalProps {
  step: ActionPlanStep | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (step: ActionPlanStep) => void;
  isExecuting: boolean;
}

export const HumanApprovalModal: React.FC<HumanApprovalModalProps> = ({
  step,
  isOpen,
  onClose,
  onConfirm,
  isExecuting
}) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !step) return null;

  const isCritical = step.dangerLevel === 'HIGH' || step.dangerLevel === 'CRITICAL';

  const copyCommand = () => {
    navigator.clipboard.writeText(step.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
          isCritical 
            ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60' 
            : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60'
        }`}>
          <div className="flex items-center gap-3.5 min-w-0">
            <div className={`p-2.5 rounded-xl shrink-0 ${
              isCritical 
                ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300' 
                : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
            }`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Human Approval Gate Required
                </h3>
                <span className={`text-xs uppercase font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                  isCritical 
                    ? 'bg-rose-100 dark:bg-rose-900/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200' 
                    : 'bg-amber-100 dark:bg-amber-900/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                }`}>
                  {step.dangerLevel} DANGER
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 font-sans">
                Specification Clause 8: Mutating production operations require explicit engineer authorization.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm font-mono bg-white dark:bg-slate-900">
          {/* Action Overview */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-slate-500 dark:text-slate-400 uppercase text-xs font-bold block font-sans">
              Step {step.stepNumber} ({step.phase}) Action Description:
            </span>
            <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 font-sans break-words">
              {step.title}
            </div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans break-words">
              Expected Outcome: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{step.expectedResult}</span>
            </div>
          </div>

          {/* Command to Execute */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm uppercase font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Command to be Dispatched:
              </span>
              <button
                onClick={copyCommand}
                className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 flex items-center gap-1.5 font-medium px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-emerald-300 text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-all leading-relaxed shadow-inner font-mono">
              $ {step.command}
            </pre>
          </div>

          {/* Blast Radius & Rollback */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold block font-sans">Estimated Blast Radius:</span>
              <p className="text-slate-700 dark:text-slate-300 font-sans text-xs sm:text-sm leading-relaxed break-words">
                {step.command.includes('configmap') 
                  ? 'Zero pod downtime. Dynamically modifies connection ceiling in checkout-db-pool from 50 to 120.'
                  : 'Terminates and respawns active worker pods. Drops existing in-flight HTTP requests temporarily.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold block font-sans">Pre-Computed Rollback Plan:</span>
              <p className="text-slate-700 dark:text-slate-300 font-sans text-xs sm:text-sm leading-relaxed break-words">
                {step.command.includes('configmap') 
                  ? 'Re-apply original ConfigMap definition (MAX_CONNECTIONS: 50) and dispatch SIGHUP.'
                  : 'kubectl rollout undo deployment/checkout-api -n payments'}
              </p>
            </div>
          </div>

          {/* Warning notice if rolling restart */}
          {step.command.includes('rollout restart') && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-800 dark:text-rose-200 flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-rose-900 dark:text-rose-100 block text-xs sm:text-sm">ANTI-PATTERN WARNING (MEM-042)</strong>
                <p className="font-sans text-xs sm:text-sm text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
                  Historical post-mortem PM-2026-0098 demonstrated that restarting pods during PostgreSQL socket exhaustion temporarily clears metrics for 45s, but then causes immediate CrashLoopBackOff as new pods fight for sockets.
                </p>
              </div>
            </div>
          )}

          {/* Safety Checkbox */}
          <label className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 cursor-pointer select-none hover:bg-slate-100/60 dark:hover:bg-slate-800 transition-colors">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-slate-700 dark:text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
              I have verified the command syntax, blast radius, and automated rollback path. I authorize execution on target environment <strong className="text-slate-900 dark:text-slate-100 font-semibold">gke-production / payments</strong>.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isExecuting}
            className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel / Abort
          </button>

          <button
            onClick={() => onConfirm(step)}
            disabled={!acknowledged || isExecuting}
            className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl font-mono flex items-center gap-2 transition-all shadow-xs ${
              acknowledged && !isExecuting
                ? isCritical
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{isExecuting ? 'Executing CLI in Cluster...' : 'Authorize & Execute Mutation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
