import React, { useState } from 'react';
import { Incident } from '../types/incident';
import { 
  Server, 
  Database, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Boxes,
  Flame,
  Zap
} from 'lucide-react';

interface TopologyPanelProps {
  incident: Incident;
  isCompact?: boolean;
}

export const TopologyPanel: React.FC<TopologyPanelProps> = ({ incident, isCompact = false }) => {
  const [copiedLog, setCopiedLog] = useState(false);
  const [showFullTrace, setShowFullTrace] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const isCritical = incident.sloDegradation.http5xxRate > 5.0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
      {/* Header & Service Envelope */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Boxes className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
              3. Synthetic Production Topology
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
            Deterministic failure context evaluated against active production envelope
          </p>
        </div>

        {/* Linked Anchor Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300">
            Runbook: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{incident.boundRunbook}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300">
            Anchor: <strong className="text-purple-600 dark:text-purple-400 font-bold">{incident.linkedMemoryAnchor}</strong>
          </span>
        </div>
      </div>

      {/* Topology & Descriptor Cards */}
      <div className={`grid gap-3.5 text-xs ${isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {/* Topology & Service Envelope */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
            Topology &amp; Service Envelope
          </div>
          <div className={`grid gap-2.5 text-slate-700 dark:text-slate-300 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
            <div className="min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-mono font-medium">Target Microservice:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm truncate block">{incident.service}</span>
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-mono font-medium">Service Owner:</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm truncate block">{incident.serviceOwner}</span>
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-mono font-medium">Dependencies:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {incident.dependencies.map(dep => (
                  <span key={dep} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-indigo-700 dark:text-indigo-400 font-semibold shadow-2xs">
                    {dep}
                  </span>
                ))}
              </div>
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-mono font-medium">Triggering Event:</span>
              <span className="text-amber-800 dark:text-amber-400 font-mono font-bold text-xs break-words">{incident.triggeringEvent}</span>
            </div>
          </div>
        </div>

        {/* Active Outage Descriptor */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
            Active Outage Descriptor
          </div>
          <div className={`grid gap-2.5 text-slate-700 dark:text-slate-300 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
            <div className="min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-mono font-medium">Incident Identifier:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 font-mono text-xs sm:text-sm truncate block">{incident.id} ({incident.severity})</span>
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-mono font-medium">Incident Status:</span>
              <span className={`font-mono font-bold text-xs sm:text-sm ${incident.status === 'RESOLVED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {incident.status}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-mono font-medium">SLO Degradation Profile:</span>
              <span className="text-rose-700 dark:text-rose-400 font-mono font-bold text-xs break-words block">
                5xx: {incident.sloDegradation.http5xxRate}% · p99: {incident.sloDegradation.p99LatencyMs}ms
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-mono font-medium">DB Connection Pool:</span>
              <span className="text-amber-800 dark:text-amber-400 font-mono font-bold text-xs break-words block">
                {incident.sloDegradation.activeConnections}/{incident.sloDegradation.maxConnections} active ({Math.round((incident.sloDegradation.activeConnections / incident.sloDegradation.maxConnections) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Telemetry Gauges */}
      <div className={`grid gap-3 ${isCompact ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
        {/* 5xx Rate */}
        <div className={`p-3.5 rounded-xl border ${
          incident.sloDegradation.http5xxRate > 1.0 
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300' 
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
        }`}>
          <div className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="font-semibold truncate">HTTP 5xx</span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px] shrink-0">&lt; 1%</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono mt-0.5 tracking-tight truncate">
            {incident.sloDegradation.http5xxRate}%
          </div>
          <div className="text-[11px] font-semibold mt-0.5 truncate">
            {incident.sloDegradation.http5xxRate > 1.0 ? '🚨 Breach (P1)' : '✔ Normal'}
          </div>
        </div>

        {/* p99 Latency */}
        <div className={`p-3.5 rounded-xl border ${
          incident.sloDegradation.p99LatencyMs > 250 
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300' 
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
        }`}>
          <div className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="font-semibold truncate">p99 Latency</span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px] shrink-0">&lt; 250ms</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono mt-0.5 tracking-tight truncate">
            {incident.sloDegradation.p99LatencyMs}ms
          </div>
          <div className="text-[11px] font-semibold mt-0.5 truncate">
            {incident.sloDegradation.p99LatencyMs > 250 ? '⚠️ High Tail' : '✔ Normal'}
          </div>
        </div>

        {/* Connection Pool */}
        <div className={`p-3.5 rounded-xl border ${
          incident.sloDegradation.activeConnections >= incident.sloDegradation.maxConnections 
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300' 
            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
        }`}>
          <div className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="font-semibold truncate">Postgres Pool</span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px] shrink-0">/{incident.sloDegradation.maxConnections}</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono mt-0.5 tracking-tight truncate">
            {incident.sloDegradation.activeConnections} / {incident.sloDegradation.maxConnections}
          </div>
          <div className="text-[11px] font-semibold mt-0.5 truncate">
            {incident.sloDegradation.activeConnections >= incident.sloDegradation.maxConnections ? '⛔ Saturated' : '✔ Available'}
          </div>
        </div>

        {/* Healthz Probe */}
        <div className={`p-3.5 rounded-xl border ${
          incident.sloDegradation.healthzFailures > 0 
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300' 
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
        }`}>
          <div className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="font-semibold truncate">Healthz Probe</span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px] shrink-0">Fails: {incident.sloDegradation.healthzFailures}</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono mt-0.5 tracking-tight truncate">
            {incident.sloDegradation.healthzFailures > 0 ? '503 UNAVAIL' : '200 OK'}
          </div>
          <div className="text-[11px] font-semibold mt-0.5 truncate">
            {incident.sloDegradation.healthzFailures > 0 ? '✖ Failed' : '✔ Passing'}
          </div>
        </div>
      </div>

      {/* Pod Grid */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono uppercase flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Worker Replica Pods (checkout-api)
          </span>
          <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
            {incident.pods.filter(p => p.healthzOk).length}/{incident.pods.length} Healthy
          </span>
        </div>

        <div className={`grid gap-2.5 ${isCompact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {incident.pods.map(pod => (
            <div 
              key={pod.id} 
              className={`p-3 rounded-xl border text-xs font-mono transition-all ${
                pod.status === 'Running' || pod.status === 'Healthy'
                  ? 'bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800/80 text-slate-900 dark:text-slate-100 shadow-2xs'
                  : pod.status === 'CrashLoopBackOff'
                  ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 shadow-2xs'
                  : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="font-bold truncate text-[11px] text-slate-900 dark:text-slate-100" title={pod.name}>
                  {pod.name.replace('checkout-api-', '')}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold whitespace-nowrap ${
                  pod.status === 'Running' || pod.status === 'Healthy' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' :
                  pod.status === 'CrashLoopBackOff' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' :
                  'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                }`}>
                  {pod.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                <div className="flex justify-between">
                  <span>DB Sockets:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">{pod.activeDbConnections}</span>
                </div>
                <div className="flex justify-between">
                  <span>Restarts:</span>
                  <span className={pod.restartCount > 2 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-800 dark:text-slate-200 font-medium'}>{pod.restartCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>healthz:</span>
                  <span className={pod.healthzOk ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                    {pod.healthzOk ? '200 OK' : '503 Fail'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Concrete Stack Trace & Seeded Log Box */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 text-slate-800 dark:text-slate-200 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span className="text-rose-700 dark:text-rose-400 font-bold text-[11px]">[2026-09-28T01:14:02.108Z] CRITICAL Stack Trace</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(incident.stackTrace)}
              className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors shadow-2xs font-mono cursor-pointer"
            >
              {copiedLog ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              <span>{copiedLog ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => setShowFullTrace(!showFullTrace)}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 font-mono font-medium cursor-pointer"
            >
              {showFullTrace ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{showFullTrace ? 'Less' : 'More'}</span>
            </button>
          </div>
        </div>

        <pre className="text-[11px] font-mono text-rose-300 dark:text-rose-300 bg-slate-950 p-3 rounded-xl border border-slate-800/90 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner break-all">
          {incident.errorLogs[0]}
          {'\n'}
          {incident.errorLogs[1]}
          {showFullTrace && (
            <>
              {'\n\n'}
              <span className="text-slate-400">--- Complete Exception Stack Frame ---</span>{'\n'}
              {incident.stackTrace}
            </>
          )}
        </pre>
      </div>
    </div>
  );
};

