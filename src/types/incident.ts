export type MemoryTier = 'EPISODIC' | 'PROCEDURAL' | 'SEMANTIC' | 'OUTCOME';

export type DemonstrationStage = 1 | 5 | 20;

export interface SLOData {
  http5xxRate: number; // percentage, e.g. 31.4
  p99LatencyMs: number; // milliseconds, e.g. 4200
  activeConnections: number; // e.g. 50
  maxConnections: number; // e.g. 50
  healthzFailures: number; // e.g. 4
  podCrashCount: number;
  podHealthyCount: number;
  podTotalCount: number;
  redisConnections: number;
  redisHitRate: number; // percentage
  dbCpuPercent: number;
  appCpuPercent: number;
}

export interface PodStatus {
  id: string;
  name: string;
  node: string;
  status: 'Running' | 'Degraded' | 'CrashLoopBackOff' | 'Terminating' | 'Healthy';
  healthzOk: boolean;
  activeDbConnections: number;
  restartCount: number;
  uptime: string;
}

export interface Incident {
  id: string;
  severity: 'P1 - CRITICAL' | 'P2 - MAJOR' | 'P3 - MODERATE';
  title: string;
  service: string;
  serviceOwner: string;
  dependencies: string[];
  triggeringEvent: string;
  boundRunbook: string;
  linkedMemoryAnchor: string;
  startTime: string;
  status: 'ACTIVE' | 'MITIGATING' | 'RESOLVED';
  sloDegradation: SLOData;
  errorLogs: string[];
  stackTrace: string;
  pods: PodStatus[];
}

export interface MemoryRecord {
  id: string;
  tier: MemoryTier;
  title: string;
  storageSemantics: string;
  operationalPayload: string;
  sreValueProposition: string;
  similarityScore: number;
  sourceIncidentId?: string;
  postMortemUrl?: string;
  successRate?: number;
  attempts?: number;
  successes?: number;
  tags: string[];
  minStage: DemonstrationStage;
  timestamp: string;
}

export interface ActionPlanStep {
  stepNumber: number;
  phase: 'Verify' | 'Mitigate' | 'Diagnose' | 'Durable Fix';
  title: string;
  command: string;
  expectedResult: string;
  isMutating: boolean;
  dangerLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface AgentNineSectionResponse {
  stage: DemonstrationStage;
  generatedAt: string;
  elapsedDiagnosisTimeMs: number;
  
  // Section 1
  currentSituation: {
    activeDegradationProfile: string;
    http5xxRate: string;
    serviceIdentity: string;
    severityLevel: string;
    summary: string;
  };

  // Section 2
  currentEvidence: {
    literalQuotes: string[];
    stackTraceExcerpt: string;
    saturationGauges: {
      metric: string;
      value: string;
      threshold: string;
      state: 'CRITICAL' | 'WARN' | 'OK';
    }[];
    failingHealthProbe: string;
  };

  // Section 3
  retrievedMemories: {
    id: string;
    tier: MemoryTier;
    title: string;
    similarityScore: number;
    provenanceLink: string;
    postMortemTakeaway: string;
  }[];

  // Section 4
  strictDiagnosis: {
    demarcation: '[Hypothesis]' | '[Verified Root Cause]';
    confidenceScore: number;
    rootCause: string;
    confidenceRationale: string;
  };

  // Section 5
  orderedActionPlan: ActionPlanStep[];

  // Section 6
  rationaleAndPrecedent: {
    causalJustification: string;
    pastSuccessFailureEvidence: string;
    antiPatternWarning?: string;
  };

  // Section 7
  uncertaintyAndCaveats: {
    knownUnknowns: string[];
    externalFactors: string[];
    invalidationConditions: string[];
  };

  // Section 8
  humanApprovalGate: {
    required: boolean;
    mutationDescription: string;
    targetResource: string;
    blastRadius: string;
    commandToExecute: string;
    rollbackPlan: string;
    verificationCheck: string;
    status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  };

  // Section 9
  memoryWriteback: {
    memoryId: string;
    tier: MemoryTier;
    synthesisSummary: string;
    immutableRecordPayload: Record<string, any>;
    newOperationalHeuristic: string;
    isCommitted: boolean;
  };
}

export interface ExecutionLogEntry {
  timestamp: string;
  command: string;
  output: string;
  type: 'cmd' | 'stdout' | 'stderr' | 'success' | 'warn';
}

export interface BenchmarkChecklistItem {
  id: string;
  label: string;
  description: string;
  satisfied: boolean;
  evidence: string;
}

export interface ToastNotification {
  id: string;
  type: 'STABILIZED' | 'REGRESSED' | 'INFO';
  title: string;
  message: string;
  details?: string;
  timestamp: string;
  duration?: number;
}
