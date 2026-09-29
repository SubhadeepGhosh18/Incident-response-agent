import React from 'react';
import { 
  AgentNineSectionResponse, 
  ActionPlanStep, 
  MemoryTier, 
  DemonstrationStage 
} from '../types/incident';
import { 
  ShieldAlert, 
  Search, 
  Database, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  Terminal, 
  Lock, 
  BookOpen, 
  FileText, 
  Play, 
  Check, 
  HelpCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';

interface AgentDiagnosisViewProps {
  diagnosis: AgentNineSectionResponse | null;
  isLoading: boolean;
  onOpenApprovalGate: (step: ActionPlanStep) => void;
  onCommitWriteback: () => void;
  onDiagnoseAgain: () => void;
  stage: DemonstrationStage;
}

export const AgentDiagnosisView: React.FC<AgentDiagnosisViewProps> = ({
  diagnosis,
  isLoading,
  onOpenApprovalGate,
  onCommitWriteback,
  onDiagnoseAgain,
  stage
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-4 shadow-xs transition-colors">
        <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center animate-spin">
          <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Autonomous SRE Diagnosis Running...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
            Evaluating live telemetry, stack traces, and 4-tier memory convergence (Stage {stage})
          </p>
        </div>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-4 shadow-xs transition-colors">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">No Active Diagnosis Generated</h3>
        <button
          onClick={onDiagnoseAgain}
          className="text-xs px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium inline-flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Execute Agent Diagnosis</span>
        </button>
      </div>
    );
  }

  const {
    currentSituation,
    currentEvidence,
    retrievedMemories,
    strictDiagnosis,
    orderedActionPlan,
    rationaleAndPrecedent,
    uncertaintyAndCaveats,
    humanApprovalGate,
    memoryWriteback
  } = diagnosis;

  const isVerifiedRootCause = strictDiagnosis.demarcation === '[Verified Root Cause]';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5 transition-colors">
      {/* Title & Schema Compliance Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 font-mono">
              5. Strict 9-Section Agent Response Contract
              <span className="text-[11px] px-2 py-0.5 rounded-full font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                100% COMPLIANT
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
            Zero-hallucination structured response grounded in live telemetry &amp; 4-tier memory
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
            Diagnosis SLA: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{Math.round(diagnosis.elapsedDiagnosisTimeMs / 1000)}s</strong>
          </span>
          <button
            onClick={onDiagnoseAgain}
            className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Re-evaluate</span>
          </button>
        </div>
      </div>

      {/* Grid of the 9 Sections */}
      <div className="space-y-4">
        {/* =========================================
            SECTION 1: Current Situation
            ========================================= */}
        <section className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold font-mono uppercase text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-[11px] font-bold text-indigo-700 dark:text-indigo-300">1</span>
              Current Situation
            </span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-bold">
              {currentSituation.severityLevel}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-0.5 min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Service Identity:</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm truncate block">{currentSituation.serviceIdentity}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-0.5 min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Error Impact (HTTP 5xx):</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold text-xs sm:text-sm truncate block">{currentSituation.http5xxRate}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-0.5 min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">Degradation Profile:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold text-xs leading-snug break-words block">{currentSituation.activeDegradationProfile}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 font-sans shadow-2xs break-words">
            {currentSituation.summary}
          </p>
        </section>

        {/* =========================================
            SECTION 2: Current Evidence
            ========================================= */}
        <section className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold font-mono uppercase text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-[11px] font-bold text-indigo-700 dark:text-indigo-300">2</span>
              Current Evidence
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">Literal Quotes &amp; Stack Traces</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Literal Quotes */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 block">Literal Quotes of Live Log Lines:</span>
              {currentEvidence.literalQuotes.map((quote, idx) => (
                <div key={idx} className="font-mono text-xs bg-white dark:bg-slate-950 p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 shadow-2xs leading-relaxed break-words break-all">
                  {quote}
                </div>
              ))}
            </div>

            {/* Failing health probe */}
            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between font-mono text-xs shadow-2xs flex-wrap gap-1">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Failing Health Probe Payload:</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold break-all">{currentEvidence.failingHealthProbe}</span>
            </div>

            {/* Saturation Gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
              {currentEvidence.saturationGauges.map((gauge, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 font-mono text-center shadow-2xs min-w-0">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium truncate">{gauge.metric}</span>
                  <span className={`text-sm font-bold block mt-0.5 truncate ${
                    gauge.state === 'CRITICAL' ? 'text-rose-600 dark:text-rose-400' : gauge.state === 'WARN' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {gauge.value}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block truncate">Limit: {gauge.threshold}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 3: Retrieved Memories
            ========================================= */}
        <section className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold font-mono uppercase text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-[11px] font-bold text-indigo-700 dark:text-indigo-300">3</span>
              Retrieved Memories (Transparent Provenance)
            </span>
            <span className="text-xs font-mono text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              {retrievedMemories.length} Records Linked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {retrievedMemories.map((mem) => (
              <div 
                key={mem.id} 
                className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between shadow-2xs space-y-2.5"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400 text-xs flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {mem.tier}
                      </span>
                      {mem.id}
                    </span>
                    <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-bold">
                      Sim: {Math.round(mem.similarityScore * 100)}%
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-sans break-words">{mem.title}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-700/60 font-sans break-words">
                    {mem.postMortemTakeaway}
                  </p>
                </div>

                <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800 gap-2">
                  <span className="truncate flex-1 min-w-0" title={mem.provenanceLink}>
                    {mem.provenanceLink}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            SECTION 4: Strict Diagnosis
            ========================================= */}
        <section className={`rounded-2xl border p-4 sm:p-5 transition-all space-y-3 ${
          isVerifiedRootCause 
            ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80' 
            : 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/80'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs sm:text-sm font-bold font-mono uppercase text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-[11px] font-bold text-indigo-700 dark:text-indigo-300">4</span>
              Strict Diagnosis
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg border ${
                isVerifiedRootCause
                  ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs'
                  : 'bg-amber-600 border-amber-700 text-white shadow-xs'
              }`}>
                {strictDiagnosis.demarcation}
              </span>
              <span className="text-xs font-mono text-slate-800 dark:text-slate-200 font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                Confidence: {strictDiagnosis.confidenceScore}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base font-sans leading-snug break-words">
              {strictDiagnosis.rootCause}
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-mono text-xs leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs break-words">
              <strong className="text-slate-500 dark:text-slate-400 block mb-0.5 uppercase text-[10px] font-bold font-sans">Confidence Rationale:</strong>
              {strictDiagnosis.confidenceRationale}
            </p>
          </div>
        </section>

        {/* =========================================
            SECTION 5: Ordered Action Plan
            ========================================= */}
        <section className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs sm:text-sm font-bold font-mono uppercase text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-[11px] font-bold text-indigo-700 dark:text-indigo-300">5</span>
              Ordered Action Plan
            </span>
            <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              Verify → Mitigate → Fix
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {orderedActionPlan.map((step) => (
              <div 
                key={step.stepNumber}
                className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-2xs space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono flex-wrap min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold flex items-center justify-center text-xs shrink-0">
                      {step.stepNumber}
                    </span>
                    <span className={`text-[11px] uppercase font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      step.phase === 'Verify' ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300' :
                      step.phase === 'Mitigate' ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300' :
                      step.phase === 'Diagnose' ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300' :
                      'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    }`}>
                      {step.phase}
                    </span>
                    <span className="text-slate-900 dark:text-slate-100 font-bold font-sans text-xs sm:text-sm break-words">{step.title}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono shrink-0">
                    {step.isMutating && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                        step.dangerLevel === 'HIGH' || step.dangerLevel === 'CRITICAL'
                          ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                          : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300'
                      }`}>
                        Mutating ({step.dangerLevel})
                      </span>
                    )}

                    <button
                      onClick={() => onOpenApprovalGate(step)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        step.isMutating 
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold' 
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <Play className="w-3 h-3" />
                      <span>{step.isMutating ? 'Approval Gate' : 'Execute CLI'}</span>
                    </button>
                  </div>
                </div>

                <div className="font-mono text-xs text-emerald-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 overflow-x-auto my-1.5 shadow-inner break-all">
                  $ {step.command}
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 font-mono break-words">
                  <span className="text-slate-400 dark:text-slate-500 font-bold">Expected: </span>
                  {step.expectedResult}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            SECTION 6: Rationale & Precedent
            ========================================= */}
        <section className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold font-mono uppercase text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-[11px] font-bold text-indigo-700 dark:text-indigo-300">6</span>
              Rationale &amp; Precedent
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium">Past Outcomes</span>
          </div>

          <div className="space-y-2.5 text-xs font-sans">
            <div className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 leading-relaxed shadow-2xs space-y-1 break-words">
              <strong className="text-slate-900 dark:text-slate-100 block text-[10px] uppercase font-mono font-bold">Causal Justification:</strong>
              <p className="leading-relaxed">{rationaleAndPrecedent.causalJustification}</p>
            </div>

            <div className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 leading-relaxed font-mono text-xs shadow-2xs space-y-1 break-words">
              <strong className="text-slate-900 dark:text-slate-100 block text-[10px] uppercase font-mono font-bold font-sans">Statistical &amp; Historical Evidence:</strong>
              <p className="leading-relaxed">{rationaleAndPrecedent.pastSuccessFailureEvidence}</p>
            </div>

            {rationaleAndPrecedent.antiPatternWarning && (
              <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 font-mono text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <strong className="font-bold block text-amber-950 dark:text-amber-200 font-sans text-xs">Anti-Pattern Suppression:</strong>
                  <p className="mt-0.5 leading-relaxed break-words">{rationaleAndPrecedent.antiPatternWarning}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================================
            SECTION 7: Uncertainty & Caveats
            ========================================= */}
        <section className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold font-mono uppercase text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-[11px] font-bold text-indigo-700 dark:text-indigo-300">7</span>
              Uncertainty &amp; Caveats
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium">Known Unknowns</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-1.5 min-w-0">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold block">Known Unknowns:</span>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                {uncertaintyAndCaveats.knownUnknowns.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 break-words">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-1.5 min-w-0">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold block">External Factors:</span>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                {uncertaintyAndCaveats.externalFactors.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 break-words">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-1.5 min-w-0">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 font-bold block">Invalidation Conditions:</span>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                {uncertaintyAndCaveats.invalidationConditions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 break-words">
                    <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 8: Human Approval Gate
            ========================================= */}
        <section className="bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200/90 dark:border-amber-800/80 p-4 sm:p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs sm:text-sm font-bold font-mono uppercase text-amber-900 dark:text-amber-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 flex items-center justify-center text-[11px] font-bold text-amber-800 dark:text-amber-300">8</span>
              Human Approval Gate (Enforced Gate)
            </span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-bold">
              PAUSED FOR APPROVAL
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-700 dark:text-slate-300">
              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs min-w-0">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Target Resource:</span>
                <span className="text-indigo-700 dark:text-indigo-400 font-bold text-xs sm:text-sm truncate block">{humanApprovalGate.targetResource}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs min-w-0">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Blast Radius:</span>
                <span className="text-slate-700 dark:text-slate-300 font-sans text-xs leading-relaxed break-words block">{humanApprovalGate.blastRadius}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-amber-300 shadow-inner">
              <span className="text-slate-400 block text-[10px] uppercase font-sans font-semibold">Proposed Mutation Command:</span>
              <code className="text-xs font-bold block mt-1 font-mono break-all">$ {humanApprovalGate.commandToExecute}</code>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-0.5">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-sans break-all">
                Rollback Plan: <span className="text-slate-900 dark:text-slate-200 font-bold font-mono">{humanApprovalGate.rollbackPlan}</span>
              </div>

              <button
                onClick={() => onOpenApprovalGate({
                  stepNumber: 2,
                  phase: 'Mitigate',
                  title: humanApprovalGate.mutationDescription,
                  command: humanApprovalGate.commandToExecute,
                  expectedResult: humanApprovalGate.verificationCheck,
                  isMutating: true,
                  dangerLevel: 'MEDIUM'
                })}
                className="text-xs px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Review &amp; Authorize</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 9: Memory Writeback
            ========================================= */}
        <section className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs sm:text-sm font-bold font-mono uppercase text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-[11px] font-bold text-indigo-700 dark:text-indigo-300">9</span>
              Memory Writeback (Automated Ingestion)
            </span>
            <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              Post-Resolution → Immutable MEM-xxx
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-1 font-mono min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-700 dark:text-indigo-400 font-bold text-sm">{memoryWriteback.memoryId}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs">({memoryWriteback.tier} Tier)</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs font-sans leading-relaxed break-words">
                  {memoryWriteback.synthesisSummary}
                </p>
                <div className="text-slate-500 dark:text-slate-400 text-xs font-sans break-words">
                  New Heuristic: <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono text-xs">{memoryWriteback.newOperationalHeuristic}</span>
                </div>
              </div>

              <button
                onClick={onCommitWriteback}
                disabled={memoryWriteback.isCommitted}
                className={`text-xs px-4 py-2 rounded-xl font-mono font-bold flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer ${
                  memoryWriteback.isCommitted
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                {memoryWriteback.isCommitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Committed to Bank</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 text-indigo-200" />
                    <span>Commit Synthesis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
