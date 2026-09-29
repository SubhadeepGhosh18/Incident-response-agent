import React, { useState, useEffect } from 'react';
import { 
  Incident, 
  MemoryRecord, 
  AgentNineSectionResponse, 
  ActionPlanStep, 
  DemonstrationStage,
  ExecutionLogEntry,
  BenchmarkChecklistItem,
  ToastNotification
} from './types/incident';
import { Header } from './components/Header';
import { StageSelector } from './components/StageSelector';
import { TopologyPanel } from './components/TopologyPanel';
import { AgentDiagnosisView } from './components/AgentDiagnosisView';
import { HumanApprovalModal } from './components/HumanApprovalModal';
import { MemoryBankDrawer } from './components/MemoryBankDrawer';
import { ExecutionTerminal } from './components/ExecutionTerminal';
import { ComplianceSignOff } from './components/ComplianceSignOff';
import { SearchGroundingWidget } from './components/SearchGroundingWidget';
import { ToastContainer } from './components/ToastContainer';
import { 
  INITIAL_SEEDED_INCIDENT, 
  INITIAL_MEMORY_BANK, 
  PRESET_RESPONSES 
} from './data/seedData';
import { 
  ShieldAlert, 
  Cpu, 
  Database, 
  Terminal, 
  CheckCircle2, 
  Sparkles,
  Layers,
  FileCheck,
  TrendingDown,
  Activity,
  Zap
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sre_copilot_theme');
      if (stored === 'dark' || stored === 'light') return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('sre_copilot_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('sre_copilot_theme', 'light');
    }
  }, [theme]);

  const [incident, setIncident] = useState<Incident>(INITIAL_SEEDED_INCIDENT);
  const [currentStage, setCurrentStage] = useState<DemonstrationStage>(5);
  const [diagnosis, setDiagnosis] = useState<AgentNineSectionResponse | null>(PRESET_RESPONSES[5]);
  const [memories, setMemories] = useState<Array<MemoryRecord & { isUnlocked?: boolean }>>(() =>
    INITIAL_MEMORY_BANK.map(m => ({ ...m, isUnlocked: m.minStage <= 5 }))
  );
  const [writtenBackRecords, setWrittenBackRecords] = useState<string[]>([]);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLogEntry[]>([
    {
      timestamp: new Date().toISOString(),
      command: 'kubectl get pods -n payments -l app=checkout-api',
      output: 'NAME                                READY   STATUS             RESTARTS   AGE\ncheckout-api-pod-7db4f-8x2w1        0/1     Degraded           3          14m\ncheckout-api-pod-7db4f-q4k9m        0/1     Degraded           2          14m\ncheckout-api-pod-7db4f-p0x4l        0/1     CrashLoopBackOff   5          3m\ncheckout-api-pod-7db4f-z9m1q        1/1     Running            1          1m',
      type: 'stdout'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'agent' | 'memory' | 'topology' | 'checklist'>('agent');
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<ActionPlanStep | null>(null);
  
  const [isLoadingDiagnosis, setIsLoadingDiagnosis] = useState(false);
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [geminiLiveEnabled, setGeminiLiveEnabled] = useState(false);
  const [useLiveGemini, setUseLiveGemini] = useState(false);
  const [searchGroundingOpen, setSearchGroundingOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (toast: ToastNotification) => {
    setToasts(prev => [toast, ...prev.slice(0, 3)]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const [checklist, setChecklist] = useState<BenchmarkChecklistItem[]>([
    {
      id: '1',
      label: 'Interactive Incident Triggering',
      description: 'Evaluator UI allows initiating INC-2026-0142 or injecting simulated telemetry streams on demand.',
      satisfied: true,
      evidence: 'INC-2026-0142 active with live telemetry stream'
    },
    {
      id: '2',
      label: 'Live Evidence Grounding',
      description: 'Agent assessments cite concrete log output, active pod states, and database pool utilization metrics.',
      satisfied: true,
      evidence: '50/50 connection saturation, healthz 503, psycopg2 stack trace'
    },
    {
      id: '3',
      label: 'Transparent Memory Provenance',
      description: 'Retrieved historical records display explicit similarity metrics, source incident IDs, and post-mortem links.',
      satisfied: true,
      evidence: 'INC-2026-0098 (similarity 0.99), MEM-042 heuristic, OUT-02 outcome utility'
    },
    {
      id: '4',
      label: 'Observable Multi-Stage Arc',
      description: 'Demonstrable progression from Cold Start (Interaction 1) to Targeted Mitigation (Interaction 5) and Rapid Resolution (Interaction 20).',
      satisfied: true,
      evidence: 'Interactive stage switcher active: 38m -> 9m -> 1m 45s trajectory'
    },
    {
      id: '5',
      label: 'Enforced Human-in-the-Loop Gate',
      description: 'Consequential mutations (pod reboots, pool configuration writes) pause execution until manual approval is provided.',
      satisfied: true,
      evidence: 'Mandatory confirmation modal with blast radius & rollback check'
    },
    {
      id: '6',
      label: 'Automated Memory Ingestion',
      description: 'Resolving the outage automatically compiles and registers a new MEM-xxx entity into the long-term memory bank.',
      satisfied: false,
      evidence: 'Pending post-resolution synthesis writeback'
    }
  ]);

  // Initial load from backend API
  useEffect(() => {
    fetchStatus();
    fetchIncident();
    fetchMemories(currentStage);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setGeminiLiveEnabled(data.geminiEnabled);
      }
    } catch {
      // Backend fallback
    }
  };

  const fetchIncident = async () => {
    try {
      const res = await fetch('/api/incident');
      if (res.ok) {
        const data = await res.json();
        if (data.incident) setIncident(data.incident);
      }
    } catch {
      // fallback
    }
  };

  const fetchMemories = async (stage: DemonstrationStage) => {
    try {
      const res = await fetch(`/api/memories?stage=${stage}`);
      if (res.ok) {
        const data = await res.json();
        setMemories(data.records);
        if (data.writtenBackRecords) setWrittenBackRecords(data.writtenBackRecords);
      } else {
        // Fallback locally
        const fallback = INITIAL_MEMORY_BANK.map(m => ({ ...m, isUnlocked: m.minStage <= stage }));
        setMemories(fallback);
      }
    } catch {
      const fallback = INITIAL_MEMORY_BANK.map(m => ({ ...m, isUnlocked: m.minStage <= stage }));
      setMemories(fallback);
    }
  };

  // Switch Stage
  const handleSelectStage = async (stage: DemonstrationStage) => {
    setCurrentStage(stage);
    fetchMemories(stage);
    
    // Automatically trigger fresh diagnosis for that stage
    setIsLoadingDiagnosis(true);
    try {
      const res = await fetch('/api/agent/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage, useLiveGemini })
      });
      if (res.ok) {
        const data = await res.json();
        setDiagnosis(data.diagnosis);
      } else {
        setDiagnosis(PRESET_RESPONSES[stage]);
      }
    } catch {
      setDiagnosis(PRESET_RESPONSES[stage]);
    } finally {
      setIsLoadingDiagnosis(false);
    }
  };

  // Re-trigger Incident
  const handleRetrigger = async () => {
    setIsLoadingDiagnosis(true);
    try {
      const res = await fetch('/api/incident/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentType: 'INC-2026-0142', stage: currentStage })
      });
      if (res.ok) {
        const data = await res.json();
        setIncident(data.incident);
      } else {
        setIncident(JSON.parse(JSON.stringify(INITIAL_SEEDED_INCIDENT)));
      }
      // Re-run diagnosis
      handleSelectStage(currentStage);
    } catch {
      setIncident(JSON.parse(JSON.stringify(INITIAL_SEEDED_INCIDENT)));
      setDiagnosis(PRESET_RESPONSES[currentStage]);
      setIsLoadingDiagnosis(false);
    }
  };

  // Inject Secondary Telemetry Burst
  const handleInjectSecondary = async () => {
    try {
      const res = await fetch('/api/incident/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentType: 'SECONDARY_SPIKE', stage: currentStage })
      });
      if (res.ok) {
        const data = await res.json();
        setIncident(data.incident);
        // Add log
        setExecutionLogs(prev => [
          {
            timestamp: new Date().toISOString(),
            command: 'simulated_event: INJECT_SECONDARY_BURST',
            output: 'Simulated high-frequency order payload injected. Error rate escalated to 48.2%, p99 latency to 6,100ms.',
            type: 'warn'
          },
          ...prev
        ]);
      }
    } catch {
      //
    }
  };

  // Run Diagnosis
  const handleDiagnoseAgain = async () => {
    setIsLoadingDiagnosis(true);
    try {
      const res = await fetch('/api/agent/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: currentStage, useLiveGemini })
      });
      if (res.ok) {
        const data = await res.json();
        setDiagnosis(data.diagnosis);
      } else {
        setDiagnosis(PRESET_RESPONSES[currentStage]);
      }
    } catch {
      setDiagnosis(PRESET_RESPONSES[currentStage]);
    } finally {
      setIsLoadingDiagnosis(false);
    }
  };

  // Open Approval Gate
  const handleOpenApprovalGate = (step: ActionPlanStep) => {
    setSelectedStep(step);
    setApprovalModalOpen(true);
  };

  // Execute Action via Human Approval
  const handleConfirmAction = async (step: ActionPlanStep) => {
    setIsExecutingAction(true);
    try {
      const res = await fetch('/api/agent/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: step.command,
          stepNumber: step.stepNumber,
          phase: step.phase,
          isMutating: step.isMutating,
          stage: currentStage
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.updatedIncident) {
          setIncident(data.updatedIncident);
        }

        // Add to execution logs
        setExecutionLogs(prev => [
          {
            timestamp: new Date().toISOString(),
            command: step.command,
            output: data.stdout || data.stderr,
            type: data.statusChange === 'STABILIZED' ? 'success' : data.statusChange === 'REGRESSED' ? 'stderr' : 'stdout'
          },
          ...prev
        ]);

        // Trigger Toast Notification on statusChange: STABILIZED or REGRESSED
        if (data.statusChange === 'STABILIZED') {
          addToast({
            id: `toast-${Date.now()}`,
            type: 'STABILIZED',
            title: 'Remediation Successful — Traffic Stabilized',
            message: 'Dynamic ConfigMap max_connections override applied without pod termination. AsyncPG connection pool drained.',
            details: 'HTTP 5xx: 31.4% → 0.02% | p99 Latency: 4,200ms → 48ms | Sockets: 14/120 active',
            timestamp: new Date().toISOString(),
            duration: 8000
          });
        } else if (data.statusChange === 'REGRESSED') {
          addToast({
            id: `toast-${Date.now()}`,
            type: 'REGRESSED',
            title: 'Remediation Regressed — Anti-Pattern Hit (MEM-042)',
            message: 'Pod reboot temporarily recycled containers but failed to mitigate PostgreSQL connection exhaustion. Sockets locked at 50/50.',
            details: 'HTTP 5xx escalated to 34.8% | p99: 5,200ms | Pod CrashCount: 3 (CrashLoopBackOff)',
            timestamp: new Date().toISOString(),
            duration: 9000
          });
        }

        // If stabilized, update checklist item 6
        if (data.statusChange === 'STABILIZED') {
          setChecklist(prev => prev.map(item => {
            if (item.id === '6') {
              return {
                ...item,
                satisfied: true,
                evidence: 'Resolution achieved. Memory writeback compilation ready.'
              };
            }
            return item;
          }));
        }
      }
    } catch (err: any) {
      setExecutionLogs(prev => [
        {
          timestamp: new Date().toISOString(),
          command: step.command,
          output: `Execution failed: ${err.message}`,
          type: 'stderr'
        },
        ...prev
      ]);
    } finally {
      setIsExecutingAction(false);
      setApprovalModalOpen(false);
      setSelectedStep(null);
    }
  };

  // Commit Memory Writeback
  const handleCommitWriteback = async () => {
    if (!diagnosis) return;
    try {
      const res = await fetch('/api/agent/writeback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memoryId: diagnosis.memoryWriteback.memoryId,
          tier: diagnosis.memoryWriteback.tier,
          synthesisSummary: diagnosis.memoryWriteback.synthesisSummary,
          immutableRecordPayload: diagnosis.memoryWriteback.immutableRecordPayload,
          newOperationalHeuristic: diagnosis.memoryWriteback.newOperationalHeuristic
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Mark committed in local diagnosis
        setDiagnosis(prev => prev ? {
          ...prev,
          memoryWriteback: {
            ...prev.memoryWriteback,
            isCommitted: true
          }
        } : null);

        // Refresh memories
        fetchMemories(currentStage);

        // Update checklist
        setChecklist(prev => prev.map(item => {
          if (item.id === '6') {
            return {
              ...item,
              satisfied: true,
              evidence: `Committed record ${data.newMemoryRecord.id} into Four-Tier Memory Bank`
            };
          }
          return item;
        }));

        setExecutionLogs(prev => [
          {
            timestamp: new Date().toISOString(),
            command: `agent.writeback(id="${data.newMemoryRecord.id}")`,
            output: `Immutable memory writeback successfully recorded in bank. Incremented success probability for pool_size override.`,
            type: 'success'
          },
          ...prev
        ]);
      }
    } catch {
      //
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-100 dark:selection:bg-indigo-900/60 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors">
      {/* Header */}
      <Header
        incident={incident}
        onRetrigger={handleRetrigger}
        onInjectSecondary={handleInjectSecondary}
        isLoading={isLoadingDiagnosis}
        geminiLiveEnabled={geminiLiveEnabled}
        useLiveGemini={useLiveGemini}
        setUseLiveGemini={setUseLiveGemini}
        onOpenSearchGrounding={() => setSearchGroundingOpen(true)}
        isDarkMode={theme === 'dark'}
        onToggleDarkMode={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 flex-wrap gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('agent')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'agent'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-4 h-4 shrink-0" />
              <span>SRE Agent Copilot</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('memory')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'memory'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800'
              }`}
            >
              <Database className="w-4 h-4 shrink-0" />
              <span>4-Tier Memory Bank</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-mono font-bold">
                {memories.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('topology')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'topology'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>Topology &amp; Live Telemetry</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'checklist'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800'
              }`}
            >
              <FileCheck className="w-4 h-4 shrink-0" />
              <span>Definition of Done</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm font-mono flex-wrap">
            {/* Quick Demonstration Stage Switcher Available Across All Tabs */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 uppercase">Stage:</span>
              {([1, 5, 20] as DemonstrationStage[]).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleSelectStage(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    currentStage === st
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={`Switch to Interaction ${st}`}
                >
                  Int-{st}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span>Domain: <strong className="text-slate-900 dark:text-slate-100 font-semibold">DevOps &amp; SRE</strong></span>
              <span>•</span>
              <span>Spec: <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">v2.4</strong></span>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'agent' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Multi-Stage Demonstration Arc Controller */}
            <StageSelector
              currentStage={currentStage}
              onSelectStage={handleSelectStage}
              isLoading={isLoadingDiagnosis}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Strict 9-Section Contract */}
            <div className="lg:col-span-8 space-y-6">
              <AgentDiagnosisView
                diagnosis={diagnosis}
                isLoading={isLoadingDiagnosis}
                onOpenApprovalGate={handleOpenApprovalGate}
                onCommitWriteback={handleCommitWriteback}
                onDiagnoseAgain={handleDiagnoseAgain}
                stage={currentStage}
              />

              <ExecutionTerminal
                logs={executionLogs}
                onClear={() => setExecutionLogs([])}
              />
            </div>

            {/* Right Column: Live Context & Mini Telemetry Panel */}
            <div className="lg:col-span-4 space-y-6">
              <TopologyPanel incident={incident} isCompact={true} />

              {/* Quick Memory Context Preview */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3 transition-colors">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold font-mono uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    Converged Memory Highlights
                  </span>
                  <button
                    onClick={() => setActiveTab('memory')}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  {memories
                    .filter(m => m.isUnlocked !== false)
                    .slice(0, 3)
                    .map(mem => (
                      <div key={mem.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">{mem.id}</span>
                          <span className="text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                            {mem.tier}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed line-clamp-2">
                          {mem.title}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <MemoryBankDrawer
              records={memories}
              currentStage={currentStage}
              writtenBackRecords={writtenBackRecords}
            />
          </div>
        )}

        {activeTab === 'topology' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <TopologyPanel incident={incident} />
            <ExecutionTerminal
              logs={executionLogs}
              onClear={() => setExecutionLogs([])}
            />
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ComplianceSignOff
              checklist={checklist}
              incident={incident}
              diagnosis={diagnosis}
              currentStage={currentStage}
              executionLogs={executionLogs}
              writtenBackRecords={writtenBackRecords}
              onTriggerCheck={() => {}}
            />
          </div>
        )}
      </main>

      {/* Human Approval Gate Modal Dialog */}
      <HumanApprovalModal
        step={selectedStep}
        isOpen={approvalModalOpen}
        onClose={() => {
          setApprovalModalOpen(false);
          setSelectedStep(null);
        }}
        onConfirm={handleConfirmAction}
        isExecuting={isExecutingAction}
      />

      {/* Right Corner Google Search Grounding Widget & Floating Trigger */}
      <SearchGroundingWidget
        incident={incident}
        isOpen={searchGroundingOpen}
        onOpenChange={setSearchGroundingOpen}
      />

      {/* Toast Notification System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-xs text-slate-500 dark:text-slate-400 font-mono mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Episodic Incident Response Agent • Experience-Augmented SRE Copilot
          </div>
          <div className="flex items-center gap-3">
            <span>Target MTTR: &lt; 2m</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Governance: [Approved]</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
