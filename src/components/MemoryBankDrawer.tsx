import React, { useState } from 'react';
import { MemoryRecord, MemoryTier, DemonstrationStage } from '../types/incident';
import { 
  Database, 
  Layers, 
  Search, 
  Filter, 
  ExternalLink, 
  Lock, 
  Unlock, 
  Sparkles, 
  CheckCircle2, 
  Tag, 
  BookOpen, 
  History, 
  Activity, 
  Zap,
  Clock
} from 'lucide-react';

interface MemoryBankDrawerProps {
  records: Array<MemoryRecord & { isUnlocked?: boolean }>;
  currentStage: DemonstrationStage;
  writtenBackRecords: string[];
}

export const MemoryBankDrawer: React.FC<MemoryBankDrawerProps> = ({
  records,
  currentStage,
  writtenBackRecords
}) => {
  const [selectedTier, setSelectedTier] = useState<MemoryTier | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const tiers: Array<{ tier: MemoryTier; label: string; desc: string; color: string; badge: string }> = [
    {
      tier: 'EPISODIC',
      label: 'Episodic',
      desc: 'Chronological outage traces, failure timelines, runbook attempts.',
      color: 'text-indigo-700 border-indigo-200 bg-indigo-50',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      tier: 'PROCEDURAL',
      label: 'Procedural',
      desc: 'Executable diagnostic trees, command recipes, validation order.',
      color: 'text-cyan-700 border-cyan-200 bg-cyan-50',
      badge: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    },
    {
      tier: 'SEMANTIC',
      label: 'Semantic',
      desc: 'Generalized operational heuristics extracted from post-mortems.',
      color: 'text-purple-700 border-purple-200 bg-purple-50',
      badge: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      tier: 'OUTCOME',
      label: 'Outcome',
      desc: 'Empirical remediation track records and success probabilities.',
      color: 'text-emerald-700 border-emerald-200 bg-emerald-50',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  const filteredRecords = records.filter(r => {
    if (selectedTier !== 'ALL' && r.tier !== selectedTier) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${r.id} ${r.title} ${r.operationalPayload} ${r.tags.join(' ')}`.toLowerCase();
      return matchText.includes(q);
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800 flex items-center justify-center">
              <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              2. Four-Tier Engineering Memory Taxonomy &amp; Convergence
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
            Persistent episodic execution traces, failure modes, and runbook efficacy
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 dark:text-slate-400">Corpus Capacity:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold">
            {records.filter(r => r.isUnlocked !== false).length} Unlocked / {records.length} Total
          </span>
        </div>
      </div>

      {/* Memory Convergence Principle Banner */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/80 text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-sans">
        <strong className="text-indigo-800 dark:text-indigo-300 font-bold uppercase font-mono block mb-0.5">
          Memory Convergence Principle:
        </strong>
        During triage, episodic traces supply candidate runbooks (Procedural), filtered by empirical success rates (Outcome), and constrained by historical systemic invariants (Semantic). The agent behaves as a seasoned colleague rather than a raw search engine.
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedTier('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
            selectedTier === 'ALL'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          All ({records.length})
        </button>

        {tiers.map(t => {
          const count = records.filter(r => r.tier === t.tier).length;
          const isSelected = selectedTier === t.tier;
          return (
            <button
              key={t.tier}
              onClick={() => setSelectedTier(t.tier)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border cursor-pointer ${
                isSelected
                  ? t.color + ' font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span>{t.label}</span>
              <span className="text-[11px] opacity-75 font-semibold">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by ID (e.g. INC-2026-0098, MEM-042, RB-CHK-07) or keyword..."
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono shadow-2xs"
        />
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[500px] overflow-y-auto pr-1">
        {filteredRecords.map((item) => {
          const isUnlocked = item.isUnlocked !== false;
          const isNewlyWritten = writtenBackRecords.includes(item.id);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isNewlyWritten 
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 shadow-sm' 
                  : isUnlocked
                  ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs'
                  : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 opacity-60'
              }`}
            >
              <div>
                {/* Meta Row */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                      {item.id}
                    </span>
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border uppercase font-bold ${
                      item.tier === 'EPISODIC' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' :
                      item.tier === 'PROCEDURAL' ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' :
                      item.tier === 'SEMANTIC' ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' :
                      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    }`}>
                      {item.tier}
                    </span>
                    {isNewlyWritten && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                        NEW WRITEBACK
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 font-mono text-[11px] shrink-0">
                    {isUnlocked ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Unlock className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                        <Lock className="w-3 h-3" />
                        <span>Stage {item.minStage}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5 font-sans break-words">
                  {item.title}
                </h3>

                {/* Operational Payload */}
                <div className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 mb-2.5 leading-relaxed break-words break-all">
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] block font-bold mb-0.5 uppercase font-sans">
                    Operational Payload:
                  </span>
                  {item.operationalPayload}
                </div>

                {/* SRE Value Prop */}
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2.5 leading-relaxed font-sans break-words">
                  <strong className="text-slate-800 dark:text-slate-200 font-semibold">SRE Value: </strong>
                  {item.sreValueProposition}
                </p>
              </div>

              {/* Footer with stats / tags */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 flex-wrap gap-1.5">
                <div className="flex items-center gap-1 flex-wrap">
                  {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px]">
                      #{tag}
                    </span>
                  ))}
                </div>

                {item.successRate !== undefined && (
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                    Success: {item.successRate}% ({item.successes}/{item.attempts})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
