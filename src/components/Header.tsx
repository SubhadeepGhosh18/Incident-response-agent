import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  Zap, 
  Cpu, 
  Layers,
  Sparkles,
  Play,
  Sun,
  Moon
} from 'lucide-react';
import { Incident } from '../types/incident';

interface HeaderProps {
  incident: Incident;
  onRetrigger: () => void;
  onInjectSecondary: () => void;
  isLoading: boolean;
  geminiLiveEnabled: boolean;
  useLiveGemini: boolean;
  setUseLiveGemini: (val: boolean) => void;
  onOpenSearchGrounding?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  incident,
  onRetrigger,
  onInjectSecondary,
  isLoading,
  geminiLiveEnabled,
  useLiveGemini,
  setUseLiveGemini,
  onOpenSearchGrounding,
  isDarkMode,
  onToggleDarkMode
}) => {
  const isResolved = incident.status === 'RESOLVED';

  return (
    <header className="border-b border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          {/* Brand & Specification Meta */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 p-0.5 shadow-sm shadow-indigo-500/20 flex-shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg lg:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 truncate">
                  <span>Episodic Incident Response Agent</span>
                  <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 font-bold shrink-0">
                    v2.4-PRODUCTION
                  </span>
                </h1>
                <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs sm:text-sm font-mono text-indigo-600 dark:text-indigo-400 font-bold whitespace-nowrap">Target SLA: MTTR &lt; 2m</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Experience-Augmented SRE Copilot via Four-Tier Engineering Memory
              </p>
            </div>
          </div>

          {/* Incident Status Pill & Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            {/* Dark / Light Mode Switcher */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all shadow-2xs flex items-center gap-2 font-mono text-xs font-semibold cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
                  <span className="hidden md:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600 animate-in spin-in-90 duration-200" />
                  <span className="hidden md:inline">Dark</span>
                </>
              )}
            </button>

            {/* Status Indicator */}
            <div className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-mono flex items-center gap-2 font-semibold shadow-2xs whitespace-nowrap ${
              isResolved 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' 
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 animate-pulse'
            }`}>
              {isResolved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>SLO RESTORED (HEALTHY)</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>{incident.id} {incident.severity}</span>
                </>
              )}
            </div>

            {/* Google Search Grounding Button on Right Corner */}
            {onOpenSearchGrounding && (
              <button
                onClick={onOpenSearchGrounding}
                className="text-xs sm:text-sm px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono flex items-center gap-2 transition-all shadow-xs group whitespace-nowrap"
                title="Search live Google Search data (Gemini 3.5 Flash)"
              >
                <div className="flex items-center text-xs font-bold">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-semibold hidden sm:inline">Search</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-600 font-bold">
                  3.5
                </span>
              </button>
            )}

            {/* Live Gemini Toggle if Key available */}
            {geminiLiveEnabled && (
              <button
                onClick={() => setUseLiveGemini(!useLiveGemini)}
                className={`text-xs sm:text-sm px-3 py-1.5 sm:py-2 rounded-xl border font-mono flex items-center gap-2 transition-all whitespace-nowrap ${
                  useLiveGemini 
                    ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 font-bold' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                title="Toggle Gemini 3.8 Flash live reasoning"
              >
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Gemini 3.8: {useLiveGemini ? 'ON' : 'OFF'}</span>
              </button>
            )}

            {/* Telemetry Actions */}
            <button
              onClick={onInjectSecondary}
              disabled={isLoading || isResolved}
              className="text-xs sm:text-sm px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 font-medium whitespace-nowrap"
              title="Inject secondary latency burst to test dynamic triage"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Spike</span>
            </button>

            <button
              onClick={onRetrigger}
              disabled={isLoading}
              className="text-xs sm:text-sm px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition-all disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Operational Blueprint Axiom Banner */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 truncate">
            <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold truncate">“The next incident should be easier because the agent remembers the last one.”</span>
            <span className="hidden md:inline text-slate-400 dark:text-slate-500 shrink-0">— SRE Copilot Axiom</span>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-slate-500 dark:text-slate-400 font-mono text-xs shrink-0">
            <span>Domain: Engineering &amp; DevOps</span>
            <span>•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">SRE Governance: [Approved]</span>
          </div>
        </div>
      </div>
    </header>
  );
};
