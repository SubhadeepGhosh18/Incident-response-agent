import React, { useState } from 'react';
import { 
  Incident, 
  AgentNineSectionResponse, 
  DemonstrationStage, 
  ExecutionLogEntry, 
  BenchmarkChecklistItem 
} from '../types/incident';
import { 
  Download, 
  Copy, 
  Check, 
  X, 
  FileText, 
  Code, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  Database,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident;
  diagnosis: AgentNineSectionResponse | null;
  currentStage: DemonstrationStage;
  executionLogs: ExecutionLogEntry[];
  writtenBackRecords: string[];
  checklist: BenchmarkChecklistItem[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  incident,
  diagnosis,
  currentStage,
  executionLogs,
  writtenBackRecords,
  checklist
}) => {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'json' | 'executive'>('json');

  if (!isOpen) return null;

  const isResolved = incident.status === 'RESOLVED';
  const now = new Date().toISOString();

  // Construct the structured JSON incident report
  const reportData = {
    reportMetadata: {
      reportId: `PMR-${incident.id}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
      generatedAt: now,
      specificationVersion: 'v2.4-PRODUCTION',
      domain: 'Engineering & DevOps',
      classification: 'SRE Post-Mortem & Memory Synthesis Report',
      targetSLA: 'MTTR < 2 Minutes',
      slaStatus: isResolved ? 'COMPLIANT' : 'IN_PROGRESS'
    },
    incidentSummary: {
      incidentId: incident.id,
      severity: incident.severity,
      title: incident.title,
      targetMicroservice: incident.service,
      serviceOwner: incident.serviceOwner,
      dependencies: incident.dependencies,
      triggeringEvent: incident.triggeringEvent,
      boundRunbook: incident.boundRunbook,
      linkedMemoryAnchor: incident.linkedMemoryAnchor,
      status: incident.status,
      startTime: incident.startTime,
      resolvedTime: isResolved ? now : null,
      mttrSeconds: currentStage === 20 ? 105 : currentStage === 5 ? 540 : 2280,
      mttrFormatted: currentStage === 20 ? '1m 45s' : currentStage === 5 ? '9m 00s' : '38m 00s',
      mttrReductionVsBaseline: currentStage === 20 ? '-94%' : currentStage === 5 ? '-76%' : 'Baseline'
    },
    sloDegradationProfile: {
      http5xxRate: {
        peak: '31.4%',
        recovered: `${incident.sloDegradation.http5xxRate}%`,
        status: incident.sloDegradation.http5xxRate <= 1.0 ? 'HEALTHY' : 'CRITICAL_BREACH'
      },
      p99Latency: {
        peak: '4,200ms',
        recovered: `${incident.sloDegradation.p99LatencyMs}ms`,
        status: incident.sloDegradation.p99LatencyMs <= 250 ? 'HEALTHY' : 'CRITICAL_BREACH'
      },
      databaseConnectionPool: {
        initialSaturation: '50/50 connections active (100% saturation)',
        currentUtilization: `${incident.sloDegradation.activeConnections}/${incident.sloDegradation.maxConnections} connections active`,
        status: incident.sloDegradation.activeConnections < incident.sloDegradation.maxConnections ? 'HEALTHY' : 'SATURATED'
      },
      healthzProbes: {
        failingPayload: incident.errorLogs[1] || 'HTTP 503 Service Unavailable',
        currentStatus: incident.sloDegradation.healthzFailures === 0 ? 'HTTP 200 OK' : 'HTTP 503 Service Unavailable'
      },
      workerPods: incident.pods.map(pod => ({
        name: pod.name,
        status: pod.status,
        healthzOk: pod.healthzOk,
        activeDbConnections: pod.activeDbConnections,
        restartCount: pod.restartCount
      }))
    },
    incidentTimeline: [
      {
        timestamp: '2026-09-28T00:57:00Z',
        stage: 'Triggering Event',
        detail: 'Deployment DEP-8841 committed to payment-platform repository (T-17m before failure).'
      },
      {
        timestamp: incident.startTime,
        stage: 'Outage Inception',
        detail: 'psycopg2.OperationalError: pool timeout: server connection limit reached (50/50 connections active).'
      },
      {
        timestamp: '2026-09-28T01:14:05Z',
        stage: 'SLO Breach Detected',
        detail: 'Kubernetes healthz probe failed: HTTP 503 Service Unavailable (consecutive failures: 4). HTTP 5xx spiked to 31.4%.'
      },
      {
        timestamp: '2026-09-28T01:14:15Z',
        stage: `SRE Copilot Stage ${currentStage} Triage`,
        detail: `Agent converged 4-tier memory bank: retrieved ${diagnosis?.retrievedMemories.map(m => m.id).join(', ') || 'INC-2026-0098, MEM-042'}.`
      },
      ...(executionLogs.map(entry => ({
        timestamp: entry.timestamp,
        stage: 'Remediation Execution',
        detail: `Executed CLI: ${entry.command}`
      }))),
      ...(isResolved ? [{
        timestamp: now,
        stage: 'Outage Resolution',
        detail: 'ConfigMap dynamic pool size expansion verified. HTTP 5xx stabilized to 0.02%, p99 latency restored to 48ms, sockets: 14/120.'
      }] : [])
    ],
    strictDiagnosis: diagnosis?.strictDiagnosis || {
      demarcation: '[Verified Root Cause]',
      confidenceScore: 92,
      rootCause: 'PostgreSQL connection pool exhaustion (50/50 active). Worker threads holding connection locks during payment processing transaction pipeline.',
      confidenceRationale: 'Exact match with INC-2026-0098 stack trace and timing curve.'
    },
    retrievedMemoryProvenance: diagnosis?.retrievedMemories || [],
    orderedRemediationPlan: diagnosis?.orderedActionPlan || [],
    antiPatternPruning: {
      antiPatternWarning: diagnosis?.rationaleAndPrecedent.antiPatternWarning || 'Suppressed pod restart anti-pattern via MEM-042.',
      prunedActions: currentStage >= 5 ? ['Generic pod rollout restart (suppressed by MEM-042 due to 25% utility and CrashLoopBackOff risk)'] : []
    },
    humanApprovalAuditTrail: {
      required: true,
      enforcedGateStatus: 'CONFIRMED',
      executedCommands: executionLogs.map(h => ({
        command: h.command,
        timestamp: h.timestamp,
        type: h.type,
        outputExcerpt: h.output.split('\n')[0]
      }))
    },
    memoryWritebackSynthesis: {
      committedRecordId: writtenBackRecords[0] || diagnosis?.memoryWriteback.memoryId || 'MEM-043',
      tier: diagnosis?.memoryWriteback.tier || 'OUTCOME',
      synthesisSummary: diagnosis?.memoryWriteback.synthesisSummary || 'Dynamic pool size override verified against PostgreSQL 15 pool saturation.',
      newOperationalHeuristic: diagnosis?.memoryWriteback.newOperationalHeuristic || 'Targeted pool override successfully confirmed; outcome probability elevated.',
      isCommittedToBank: writtenBackRecords.length > 0 || Boolean(diagnosis?.memoryWriteback.isCommitted)
    },
    complianceSignOffs: {
      sreGovernanceLead: 'Approved',
      coreInfrastructureSquad: 'Approved',
      benchmarkCriteriaChecklist: checklist.map(c => ({ id: c.id, label: c.label, evidence: c.evidence })),
      verificationStatus: 'READY FOR DEMO'
    }
  };

  const jsonString = JSON.stringify(reportData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-report-${incident.id}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
                  Export Incident Report (Post-Mortem JSON)
                </h3>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold">
                  {reportData.reportMetadata.reportId}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Machine-readable structured post-mortem summary for incident archives &amp; SRE governance.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher & Action Toolbar */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => setActiveView('json')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-mono font-medium flex items-center gap-2 transition-all ${
                activeView === 'json'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Structured JSON View</span>
            </button>

            <button
              onClick={() => setActiveView('executive')}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-mono font-medium flex items-center gap-2 transition-all ${
                activeView === 'executive'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Executive Post-Mortem Preview</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="text-xs sm:text-sm px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-2 font-mono font-medium transition-colors shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="text-xs sm:text-sm px-4.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-mono font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download .json</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 font-mono text-xs sm:text-sm bg-white dark:bg-slate-900">
          {activeView === 'json' ? (
            <div className="relative">
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-emerald-300 text-xs sm:text-sm leading-relaxed overflow-x-auto select-all shadow-inner font-mono">
                {jsonString}
              </pre>
            </div>
          ) : (
            <div className="space-y-5 font-sans text-xs sm:text-sm">
              {/* Executive Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 uppercase">
                    Incident Executive Overview
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
                    Target SLA: MTTR &lt; 2m (Satisfied: {reportData.incidentSummary.mttrFormatted})
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs sm:text-sm">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-slate-400 dark:text-slate-500 block text-xs">Service:</span>
                    <span className="text-slate-900 dark:text-slate-100 font-bold truncate block">{incident.service}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-slate-400 dark:text-slate-500 block text-xs">Severity:</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">{incident.severity}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-slate-400 dark:text-slate-500 block text-xs">Status:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{incident.status}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-slate-400 dark:text-slate-500 block text-xs">MTTR Reduction:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{reportData.incidentSummary.mttrReductionVsBaseline}</span>
                  </div>
                </div>
              </div>

              {/* Telemetry Delta Table */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase block">
                  Outage Telemetry Delta Profile
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs sm:text-sm">
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">HTTP 5xx Error Rate:</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-rose-500 line-through">31.4%</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{reportData.sloDegradationProfile.http5xxRate.recovered}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">p99 Latency:</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-rose-500 line-through">4,200ms</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{reportData.sloDegradationProfile.p99Latency.recovered}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-slate-500 dark:text-slate-400 block text-xs">PostgreSQL 15 Pool:</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-rose-500 line-through">50/50</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{reportData.sloDegradationProfile.databaseConnectionPool.currentUtilization}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Incident Timeline */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase block">
                  Incident Timeline &amp; Execution Audit
                </span>
                <div className="space-y-2.5">
                  {reportData.incidentTimeline.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs font-mono text-xs sm:text-sm">
                      <span className="text-slate-400 dark:text-slate-500 flex-shrink-0 text-xs font-mono">
                        [{new Date(item.timestamp).toLocaleTimeString()}]
                      </span>
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold block">{item.stage}</span>
                        <span className="text-slate-700 dark:text-slate-300 font-sans text-xs sm:text-sm break-words">{item.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Memory Writeback Anchor */}
              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/70 rounded-xl flex items-center justify-between font-mono text-xs sm:text-sm flex-wrap gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-indigo-900 dark:text-indigo-300 font-bold block">
                    Committed Memory Writeback: {reportData.memoryWritebackSynthesis.committedRecordId}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm break-words block mt-0.5">
                    {reportData.memoryWritebackSynthesis.synthesisSummary}
                  </span>
                </div>
                <span className="px-3 py-1 rounded bg-indigo-600 text-white font-bold text-xs shrink-0">
                  IMMUTABLE
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 flex items-center justify-between text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400 flex-wrap gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            <span>SRE Governance: [Approved]</span>
            <span>•</span>
            <span>Core Infra: [Approved]</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-medium transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
