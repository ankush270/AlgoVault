import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2, Flame } from 'lucide-react';
import { StriverProblem, TopicCategory } from './types';
import { ProblemCard } from './ProblemCard';

interface TopicAccordionProps {
  cat: TopicCategory;
  problems: StriverProblem[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  solvedStatus: Record<string, boolean>;
  toggleSolved: (id: string) => void;
  activeSheetTab: string;
}

export const TopicAccordion: React.FC<TopicAccordionProps> = ({
  cat,
  problems,
  isExpanded,
  onToggleExpand,
  solvedStatus,
  toggleSolved,
  activeSheetTab,
}) => {
  const [internalDiffFilter, setInternalDiffFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard' | 'unsolved'>('all');

  // Compute breakdown stats for this topic
  const topicStats = useMemo(() => {
    let groupSolved = 0;
    let easy = 0, medium = 0, hard = 0;
    let easySolved = 0, mediumSolved = 0, hardSolved = 0;

    problems.forEach((p) => {
      const isDone = !!solvedStatus[p.id];
      if (isDone) groupSolved++;

      if (p.difficulty === 'Easy') {
        easy++;
        if (isDone) easySolved++;
      } else if (p.difficulty === 'Medium') {
        medium++;
        if (isDone) mediumSolved++;
      } else if (p.difficulty === 'Hard') {
        hard++;
        if (isDone) hardSolved++;
      }
    });

    return {
      groupSolved,
      easy,
      medium,
      hard,
      easySolved,
      mediumSolved,
      hardSolved,
      percent: problems.length > 0 ? Math.round((groupSolved / problems.length) * 100) : 0,
    };
  }, [problems, solvedStatus]);

  // Filter problems by internal topic tab
  const displayedProblems = useMemo(() => {
    if (internalDiffFilter === 'all') return problems;
    if (internalDiffFilter === 'unsolved') return problems.filter((p) => !solvedStatus[p.id]);
    return problems.filter((p) => p.difficulty === internalDiffFilter);
  }, [problems, internalDiffFilter, solvedStatus]);

  return (
    <div className="bg-[#0D1322]/90 border border-slate-800/90 rounded-2xl overflow-hidden transition-all duration-200 shadow-xl hover:border-slate-700">
      {/* Topic Header Accordion Button */}
      <button
        onClick={onToggleExpand}
        className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0D1322] via-[#0F172A] to-[#0D1322] hover:bg-slate-800/60 transition-all text-left group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 group-hover:border-cyan-400/50 transition-all shadow-md">
            {cat.icon}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2 flex-wrap">
              <span>{cat.title}</span>
              {activeSheetTab !== 'all' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-slate-700/80">
                  {activeSheetTab === 'striver' && 'Striver'}
                  {activeSheetTab === 'love_babbar' && 'Love Babbar'}
                  {activeSheetTab === 'fraz' && 'Fraz'}
                  {activeSheetTab === 'neetcode' && 'NeetCode 150'}
                  {activeSheetTab === 'multi' && 'Multi-Source'}
                </span>
              )}
            </h3>

            {/* Breakdown Subtitle Badges */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 font-medium flex-wrap">
              <span className="font-bold text-slate-200">{problems.length} Problems</span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" /> {topicStats.easy} Easy
              </span>
              <span className="flex items-center gap-1 text-amber-400 text-[10px] font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" /> {topicStats.medium} Med
              </span>
              <span className="flex items-center gap-1 text-rose-400 text-[10px] font-semibold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.8)]" /> {topicStats.hard} Hard
              </span>
            </div>
          </div>
        </div>

        {/* Right Stats & Expand Arrow */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-black text-cyan-300 font-mono text-xs sm:text-sm">
              {topicStats.groupSolved}/{problems.length} ({topicStats.percent}%)
            </span>
            <div className="w-24 h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 hidden sm:block">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                style={{ width: `${topicStats.percent}%` }}
              />
            </div>
          </div>

          <div className="w-9 h-9 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-all">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
        </div>
      </button>

      {/* Expanded Topic Section */}
      {isExpanded && (
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#0A0E1A] space-y-4 animate-fadeIn">
          {/* Internal Topic Filter Pills */}
          <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-800/60 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <button
                onClick={() => setInternalDiffFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  internalDiffFilter === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                All ({problems.length})
              </button>

              {topicStats.easy > 0 && (
                <button
                  onClick={() => setInternalDiffFilter('Easy')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    internalDiffFilter === 'Easy'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-emerald-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Easy ({topicStats.easy})
                </button>
              )}

              {topicStats.medium > 0 && (
                <button
                  onClick={() => setInternalDiffFilter('Medium')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    internalDiffFilter === 'Medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-amber-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Medium ({topicStats.medium})
                </button>
              )}

              {topicStats.hard > 0 && (
                <button
                  onClick={() => setInternalDiffFilter('Hard')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    internalDiffFilter === 'Hard'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-rose-400'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Hard ({topicStats.hard})
                </button>
              )}

              <button
                onClick={() => setInternalDiffFilter('unsolved')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                  internalDiffFilter === 'unsolved'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-purple-300'
                }`}
              >
                <Flame size={12} className="text-purple-400" /> Unsolved ({problems.length - topicStats.groupSolved})
              </button>
            </div>

            <div className="text-xs font-semibold text-slate-400 font-mono">
              Showing <span className="text-white">{displayedProblems.length}</span> of {problems.length}
            </div>
          </div>

          {/* Grid of Cards */}
          {displayedProblems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-1">
              <p className="font-semibold text-slate-300">No problems match the selected filter.</p>
              <p className="text-[11px] text-slate-500">Try changing your difficulty or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {displayedProblems.map((prob) => (
                <ProblemCard
                  key={prob.id}
                  prob={prob}
                  isDone={!!solvedStatus[prob.id]}
                  toggleSolved={toggleSolved}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

