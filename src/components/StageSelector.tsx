import React from 'react';
import { DemonstrationStage } from '../types/incident';
import { History, TrendingDown, BookOpen, Clock, ShieldCheck, Zap } from 'lucide-react';

interface StageSelectorProps {
  currentStage: DemonstrationStage;
  onSelectStage: (stage: DemonstrationStage) => void;
  isLoading: boolean;
}

export const StageSelector: React.FC<StageSelectorProps> = ({
  currentStage,
  onSelectStage,
  isLoading
}) => {
  const stages: Array<{
    stage: DemonstrationStage;
    label: string;
    sublabel: string;
    knowledgeState: string;
    mttrText: string;
    mttrReduction: string | null;
    barColor: string;
    barWidth: string;
    badgeColor: string;
    description: string;
  }> = [
    {
      stage: 1,
      label: 'Interaction 1',
      sublabel: 'Baseline / Cold Start',
      knowledgeState: 'Zero episodic history. Standard static markdown runbooks only.',
      mttrText: '38m 00s',
      mttrReduction: 'Baseline Benchmark',
      barColor: 'bg-rose-500',
      barWidth: 'w-full',
      badgeColor: 'border-rose-200 text-rose-700 bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:bg-rose-950/40',
      description: 'Broad, cautious troubleshooting questionnaire. Suggests generic pod restart; requests manual DB inspection. Cannot determine root cause.'
    },
    {
      stage: 5,
      label: 'Interaction 5',
      sublabel: 'Single History Match',
      knowledgeState: 'Incident INC-2026-0098 + Post-Mortem PM-2026-0098.',
      mttrText: '9m 00s',
      mttrReduction: '-76% Reduction',
      barColor: 'bg-amber-500',
      barWidth: 'w-[24%]',
      badgeColor: 'border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-900/60 dark:text-amber-300 dark:bg-amber-950/40',
      description: 'Identifies pool exhaustion signature instantly. Flags pod restart as a transient failure anti-pattern (MEM-042); prescribes targeted max_connections patch.'
    },
    {
      stage: 20,
      label: 'Interaction 20',
      sublabel: 'Multi-Incident Maturity',
      knowledgeState: 'Cross-incident corpus (19 records, 6 post-mortems, 4 runbooks).',
      mttrText: '1m 45s',
      mttrReduction: '-94% (Target SLA < 2m)',
      barColor: 'bg-emerald-500',
      barWidth: 'w-[4.6%]',
      badgeColor: 'border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-900/60 dark:text-emerald-300 dark:bg-emerald-950/40',
      description: 'Differentiates DB saturation vs redis failure (MEM-028). Discards historically invalidated steps; generates verified patch script under 90s.'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2.5">
          <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
            4. Multi-Stage Learning Curve (The Demonstration Arc)
          </h2>
        </div>
        <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Active Learning State: </span>
          <span className="text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
            Stage {currentStage}
          </span>
        </div>
      </div>

      {/* Stage Select Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {stages.map((item) => {
          const isSelected = currentStage === item.stage;
          return (
            <button
              key={item.stage}
              onClick={() => onSelectStage(item.stage)}
              disabled={isLoading}
              className={`text-left p-4.5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 shadow-2xs'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white font-mono">{item.label}</span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border font-bold ${item.badgeColor}`}>
                    {item.mttrText}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{item.sublabel}</div>

                <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 leading-relaxed font-sans break-words">
                  <span className="text-slate-900 dark:text-slate-100 font-bold block mb-0.5 font-mono text-[10px] uppercase">Knowledge State:</span>
                  {item.knowledgeState}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans line-clamp-3 break-words">
                  {item.description}
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                <span className="text-slate-400 dark:text-slate-500 text-[11px]">Resolution SLA:</span>
                <span className={`font-bold text-xs truncate ${
                  item.stage === 20 ? 'text-emerald-700 dark:text-emerald-400' :
                  item.stage === 5 ? 'text-amber-700 dark:text-amber-400' :
                  'text-rose-700 dark:text-rose-400'
                }`}>
                  {item.mttrReduction}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Empirical MTTR Trajectory Visualizer */}
      <div className="bg-slate-50/80 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
          <span className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Empirical MTTR Trajectory Curve
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-mono text-xs font-medium">SLA Target &lt; 2m (MTTR 1m 45s achieved)</span>
        </div>

        <div className="space-y-2 pt-1 font-mono text-xs">
          {stages.map(s => (
            <div key={s.stage} className="flex items-center gap-3">
              <span className="w-24 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">Stage {s.stage}:</span>
              <div className="flex-1 h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                <div className={`h-full rounded-full transition-all duration-500 ${s.barColor} ${s.barWidth}`} />
              </div>
              <span className="w-16 text-right text-[11px] font-bold text-slate-700 dark:text-slate-300 shrink-0">{s.mttrText}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
