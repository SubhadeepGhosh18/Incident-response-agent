import React, { useEffect, useState } from 'react';
import { ToastNotification } from '../types/incident';
import { 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ShieldCheck, 
  Flame, 
  Info, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastNotification; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  const duration = toast.duration || 7000;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [toast.id, duration, onDismiss]);

  const isStabilized = toast.type === 'STABILIZED';
  const isRegressed = toast.type === 'REGRESSED';

  return (
    <div 
      className={`pointer-events-auto rounded-2xl border p-5 shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 overflow-hidden relative bg-white dark:bg-slate-900 ${
        isStabilized
          ? 'border-slate-200 dark:border-slate-800 border-l-4 border-l-emerald-500 shadow-emerald-500/10 text-slate-900 dark:text-slate-100'
          : isRegressed
          ? 'border-slate-200 dark:border-slate-800 border-l-4 border-l-rose-500 shadow-rose-500/10 text-slate-900 dark:text-slate-100'
          : 'border-slate-200 dark:border-slate-800 border-l-4 border-l-indigo-500 shadow-indigo-500/10 text-slate-900 dark:text-slate-100'
      }`}
    >
      {/* Top Banner & Status Badge */}
      <div className="flex items-start justify-between gap-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isStabilized 
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
              : isRegressed
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-bounce'
              : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
          }`}>
            {isStabilized && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            {isRegressed && <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
            {!isStabilized && !isRegressed && <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                isStabilized 
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                  : isRegressed
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
              }`}>
                {isStabilized ? 'SLO RESTORED (STABILIZED)' : isRegressed ? 'INCIDENT REGRESSION (REGRESSED)' : 'INFO'}
              </span>
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                {new Date(toast.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1 leading-snug break-words">
              {toast.title}
            </h4>
          </div>
        </div>

        <button
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Body */}
      <div className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans pl-12 break-words">
        {toast.message}
      </div>

      {/* Metrics / Details Delta Pill if provided */}
      {toast.details && (
        <div className="mt-3 ml-12 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 font-medium break-words">
          {toast.details}
        </div>
      )}

      {/* Animated Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100 dark:bg-slate-800">
        <div 
          className={`h-full transition-all duration-75 ${
            isStabilized ? 'bg-emerald-500' : isRegressed ? 'bg-rose-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
