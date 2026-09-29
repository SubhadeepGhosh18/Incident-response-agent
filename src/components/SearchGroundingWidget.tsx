import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  ExternalLink, 
  Sparkles, 
  X, 
  ChevronRight, 
  Check, 
  Copy, 
  RotateCw, 
  BookOpen, 
  ShieldAlert, 
  Terminal,
  Zap
} from 'lucide-react';
import { Incident } from '../types/incident';

interface SearchGroundingWidgetProps {
  incident: Incident;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface GroundingResult {
  query: string;
  answer: string;
  webSearchQueries: string[];
  groundingChunks: Array<{ title: string; uri: string }>;
  timestamp: string;
  source: string;
}

export const SearchGroundingWidget: React.FC<SearchGroundingWidgetProps> = ({ 
  incident,
  isOpen: controlledIsOpen,
  onOpenChange
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    setInternalIsOpen(val);
    onOpenChange?.(val);
  };
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GroundingResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Suggested SRE prompts contextualized to the active incident
  const suggestedQueries = [
    'asyncpg pool timeout: server connection limit reached (50/50 connections active) fix',
    'PostgreSQL 15 pg_stat_activity identify idle in transaction sessions',
    'Envoy upstream connect error reset reason connection failure 111 ECONNREFUSED',
    'Hot-patch Kubernetes ConfigMap with SIGHUP to avoid CrashLoopBackOff'
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || isLoading) return;
    setIsLoading(true);
    setQuery(searchQuery);

    try {
      const res = await fetch('/api/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          includeContext: true
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Error fetching search grounding:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyAnswer = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Right Corner Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono text-sm border border-slate-300 dark:border-slate-700 shadow-xl flex items-center gap-3 group transition-all transform hover:scale-105"
        title="Open Live Google Search Grounding for SRE"
      >
        {/* Google Multi-color Icon Accent */}
        <div className="flex items-center gap-0.5 font-bold text-sm">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
        </div>
        <span className="font-bold">Search Data</span>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/80 flex items-center gap-1 font-bold">
          <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
          <span>Gemini 3.5</span>
        </span>
      </button>

      {/* Slide-over Right Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-colors">
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 font-mono flex items-center gap-1">
                        <span className="text-[#4285F4]">G</span>
                        <span className="text-[#EA4335]">o</span>
                        <span className="text-[#FBBC05]">o</span>
                        <span className="text-[#4285F4]">g</span>
                        <span className="text-[#34A853]">l</span>
                        <span className="text-[#EA4335]">e</span>
                        <span className="ml-1 text-slate-900 dark:text-slate-100">Search Grounding</span>
                      </h3>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono font-bold">
                        gemini-3.5-flash
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      Live web-grounded engineering intelligence &amp; external docs
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active Incident Context Banner */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2 truncate pr-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>Target: <strong className="text-slate-900 dark:text-slate-100">{incident.service}</strong></span>
                </span>
                <span className="text-amber-800 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/80 shrink-0">
                  50/50 Connections
                </span>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs sm:text-sm font-mono bg-white dark:bg-slate-900">
                {/* Search Input Bar */}
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-slate-700 dark:text-slate-300 block font-sans">
                    Query Live Google Search Data:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                      placeholder="e.g. asyncpg pool timeout fix, envoy 111 reset..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-4 pr-24 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800/90 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                    />
                    <button
                      onClick={() => handleSearch(query)}
                      disabled={isLoading || !query.trim()}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 text-white font-medium flex items-center gap-1.5 transition-colors shadow-xs text-xs sm:text-sm"
                    >
                      {isLoading ? (
                        <RotateCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      <span>Search</span>
                    </button>
                  </div>
                </div>

                {/* Quick SRE Incident Suggestions */}
                <div className="space-y-2.5">
                  <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 block font-sans">
                    Incident Pre-Configured Queries:
                  </span>
                  <div className="flex flex-col gap-2">
                    {suggestedQueries.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearch(q)}
                        disabled={isLoading}
                        className="text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 text-slate-700 dark:text-slate-300 hover:text-indigo-900 dark:hover:text-indigo-200 transition-all flex items-center justify-between group"
                      >
                        <span className="truncate pr-2 font-mono text-xs sm:text-sm">{q}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grounding Results Display */}
                {isLoading && (
                  <div className="p-8 text-center space-y-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin mx-auto" />
                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-sans">
                      Consulting Google Search data with gemini-3.5-flash...
                    </p>
                  </div>
                )}

                {result && !isLoading && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    {/* Google Search Queries Executed */}
                    {result.webSearchQueries && result.webSearchQueries.length > 0 && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                        <span className="text-xs uppercase font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-sans">
                          <Search className="w-3.5 h-3.5 text-[#4285F4]" />
                          Grounded Web Searches Performed:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {result.webSearchQueries.map((sq, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-mono shadow-xs break-all">
                              "{sq}"
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Grounded Synthesis */}
                    <div className="bg-indigo-50/40 dark:bg-indigo-950/30 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800/60 space-y-3">
                      <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-800/60 pb-2.5">
                        <span className="text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          Grounded Engineering Synthesis
                        </span>
                        <button
                          onClick={copyAnswer}
                          className="text-xs text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100 flex items-center gap-1 font-medium"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-wrap break-words">
                        {result.answer}
                      </div>
                    </div>

                    {/* Cited Web Sources & Documentation */}
                    {result.groundingChunks && result.groundingChunks.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs uppercase font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-sans">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          Grounding Sources &amp; Documentation Links:
                        </span>
                        <div className="space-y-2">
                          {result.groundingChunks.map((chunk, idx) => (
                            <a
                              key={idx}
                              href={chunk.uri || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 transition-colors group"
                            >
                              <span className="truncate pr-2 font-medium">{chunk.title}</span>
                              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
                <span>Model: <strong className="text-slate-800 dark:text-slate-200">gemini-3.5-flash</strong></span>
                <span>Tool: <strong className="text-indigo-600 dark:text-indigo-400">googleSearch</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
