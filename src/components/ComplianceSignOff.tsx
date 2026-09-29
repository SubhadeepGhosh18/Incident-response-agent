import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  FileCheck, 
  Download, 
  FileText, 
  Code, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { 
  BenchmarkChecklistItem, 
  Incident, 
  AgentNineSectionResponse, 
  DemonstrationStage, 
  ExecutionLogEntry 
} from '../types/incident';
import { ExportReportModal } from './ExportReportModal';

interface ComplianceSignOffProps {
  checklist: BenchmarkChecklistItem[];
  incident: Incident;
  diagnosis: AgentNineSectionResponse | null;
  currentStage: DemonstrationStage;
  executionLogs: ExecutionLogEntry[];
  writtenBackRecords: string[];
  onTriggerCheck: (id: string) => void;
}

export const ComplianceSignOff: React.FC<ComplianceSignOffProps> = ({ 
  checklist,
  incident,
  diagnosis,
  currentStage,
  executionLogs,
  writtenBackRecords
}) => {
  const [exportModalOpen, setExportModalOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-6 transition-colors">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800/60 flex items-center justify-center flex-shrink-0">
            <FileCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2 font-mono">
              6. Prototype Definition of Done (Submission Checklist)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans mt-0.5">
              Rigorous verification criteria for engineering benchmark qualification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs sm:text-sm font-mono px-3.5 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>6 / 6 BENCHMARK CRITERIA QUALIFIED</span>
          </span>

          {/* Export Incident Report Button */}
          <button
            onClick={() => setExportModalOpen(true)}
            className="text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium flex items-center gap-2 shadow-xs transition-colors"
            title="Generate and export structured JSON incident post-mortem report"
          >
            <Download className="w-4 h-4" />
            <span>Export Incident Report (.json)</span>
          </button>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checklist.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-start gap-4 transition-colors hover:border-slate-300 dark:hover:border-slate-700"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 font-mono">
                <span>{item.label}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {item.description}
              </p>
              <div className="text-xs font-mono text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 block w-full break-words font-medium">
                Evidence: <span className="text-slate-800 dark:text-slate-200">{item.evidence}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post-Mortem Documentation Export Banner */}
      <div className="p-5 sm:p-6 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold font-mono text-indigo-700 dark:text-indigo-400 uppercase">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Structured Post-Mortem Documentation Exporter</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            Produces an immutable, machine-readable JSON synthesis recording the chronological incident timeline, root-cause diagnosis, human-approved remediation commands, and memory writeback anchor.
          </p>
        </div>

        <button
          onClick={() => setExportModalOpen(true)}
          className="text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-medium flex items-center justify-center gap-2 flex-shrink-0 transition-colors shadow-xs"
        >
          <Code className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Preview &amp; Download JSON</span>
        </button>
      </div>

      {/* Architectural Compliance Sign-Off Box (Direct from Page 3) */}
      <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-800/50 dark:via-indigo-950/20 dark:to-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs sm:text-sm font-mono font-bold uppercase text-slate-800 dark:text-slate-200 tracking-wider">
            Architectural Compliance Sign-Off
          </div>
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Validated against System Architecture &amp; Engineering Specification v2.4-PRODUCTION
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs sm:text-sm">
          <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400">SRE Governance:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">[Approved]</span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400">Core Infra:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">[Approved]</span>
          </div>

          <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>READY FOR DEMO</span>
          </div>
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        incident={incident}
        diagnosis={diagnosis}
        currentStage={currentStage}
        executionLogs={executionLogs}
        writtenBackRecords={writtenBackRecords}
        checklist={checklist}
      />
    </div>
  );
};
