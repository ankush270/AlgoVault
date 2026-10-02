import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Star, FileText, Flame, Trophy } from 'lucide-react';
import { StriverProblem, TopicCategory } from './types';
import { ProblemCard } from './ProblemCard';
import { ContestModal } from './ContestModal';
import { useProgress } from '../../context/ProgressContext';

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
  const { progress } = useProgress();
  const [internalDiffFilter, setInternalDiffFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard' | 'starred' | 'notes' | 'unsolved'>('all');
  const [isContestOpen, setIsContestOpen] = useState(false);

  // Compute breakdown stats for this topic
  const topicStats = useMemo(() => {
    let groupSolved = 0;
    let easy = 0, medium = 0, hard = 0;
    let easySolved = 0, mediumSolved = 0, hardSolved = 0;
    let starred = 0;
    let withNotes = 0;

    problems.forEach((p) => {
      const isDone = !!solvedStatus[p.id];
      if (isDone) groupSolved++;

      if (progress.starred[p.id]) starred++;
      if (progress.notes[p.id]?.trim()) withNotes++;

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
      starred,
      withNotes,
      percent: problems.length > 0 ? Math.round((groupSolved / problems.length) * 100) : 0,
    };
  }, [problems, solvedStatus, progress.starred, progress.notes]);

  // Filter problems by internal topic tab
  const displayedProblems = useMemo(() => {
    if (internalDiffFilter === 'all') return problems;
    if (internalDiffFilter === 'unsolved') return problems.filter((p) => !solvedStatus[p.id]);
    if (internalDiffFilter === 'starred') return problems.filter((p) => progress.starred[p.id]);
    if (internalDiffFilter === 'notes') return problems.filter((p) => Boolean(progress.notes[p.id]?.trim()));
    return problems.filter((p) => p.difficulty === internalDiffFilter);
  }, [problems, internalDiffFilter, solvedStatus, progress.starred, progress.notes]);

  return (
    <div className="bg-white/90 border border-slate-200/90 rounded-2xl overflow-hidden transition-all duration-200 shadow-md hover:border-slate-300">
      {/* Topic Header Accordion Button */}
      <button
        onClick={onToggleExpand}
        className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-slate-50/90 transition-all text-left group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 group-hover:border-cyan-400/50 transition-all shadow-md">
            {cat.icon}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>{cat.title}</span>
              {activeSheetTab !== 'all' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-cyan-700 border border-slate-200">
                  {activeSheetTab === 'striver' && 'Striver'}
                  {activeSheetTab === 'love_babbar' && 'Love Babbar'}
                  {activeSheetTab === 'fraz' && 'Fraz'}
                  {activeSheetTab === 'neetcode' && 'NeetCode 150'}
                  {activeSheetTab === 'multi' && 'Multi-Source'}
                </span>
              )}
            </h3>

            {/* Breakdown Subtitle Badges */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 font-medium flex-wrap">
              <span className="font-bold text-slate-700">{problems.length} Problems</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-emerald-700 text-[10px] font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {topicStats.easy} Easy
              </span>
              <span className="flex items-center gap-1 text-amber-700 text-[10px] font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {topicStats.medium} Med
              </span>
              <span className="flex items-center gap-1 text-rose-700 text-[10px] font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {topicStats.hard} Hard
              </span>
              {topicStats.starred > 0 && (
                <span className="flex items-center gap-1 text-amber-700 text-[10px] font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-300">
                  <Star size={11} className="fill-amber-400 text-amber-500" /> {topicStats.starred} Starred
                </span>
              )}
              {topicStats.withNotes > 0 && (
                <span className="flex items-center gap-1 text-purple-700 text-[10px] font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                  <FileText size={11} className="text-purple-600" /> {topicStats.withNotes} Notes
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Stats & Expand Arrow */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-black text-cyan-700 font-mono text-xs sm:text-sm">
              {topicStats.groupSolved}/{problems.length} ({topicStats.percent}%)
            </span>
            <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 hidden sm:block">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                style={{ width: `${topicStats.percent}%` }}
              />
            </div>
          </div>

          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-cyan-700 group-hover:border-cyan-400/40 transition-all">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
        </div>
      </button>

      {/* Expanded Topic Section */}
      {isExpanded && (
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-4 animate-fadeIn">
          {/* Internal Topic Filter Pills */}
          <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2 py-1">
              <button
                onClick={() => setInternalDiffFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  internalDiffFilter === 'all'
                    ? 'bg-cyan-500/20 text-cyan-800 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                All ({problems.length})
              </button>

              {topicStats.easy > 0 && (
                <button
                  onClick={() => setInternalDiffFilter('Easy')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    internalDiffFilter === 'Easy'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-500/40 shadow-sm'
                      : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-emerald-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Easy ({topicStats.easy})
                </button>
              )}

              {topicStats.medium > 0 && (
                <button
                  onClick={() => setInternalDiffFilter('Medium')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    internalDiffFilter === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border border-amber-300 shadow-sm'
                      : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-amber-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Medium ({topicStats.medium})
                </button>
              )}

              {topicStats.hard > 0 && (
                <button
                  onClick={() => setInternalDiffFilter('Hard')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    internalDiffFilter === 'Hard'
                      ? 'bg-rose-50 text-rose-700 border border-rose-300 shadow-sm'
                      : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-rose-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Hard ({topicStats.hard})
                </button>
              )}

              {topicStats.starred > 0 && (
                <button
                  onClick={() => setInternalDiffFilter('starred')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    internalDiffFilter === 'starred'
                      ? 'bg-amber-50 text-amber-700 border border-amber-300 shadow-sm'
                      : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-amber-600 hover:bg-slate-100'
                  }`}
                >
                  <Star size={12} className="fill-amber-400 text-amber-500" /> Starred ({topicStats.starred})
                </button>
              )}

              {topicStats.withNotes > 0 && (
                <button
                  onClick={() => setInternalDiffFilter('notes')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                    internalDiffFilter === 'notes'
                      ? 'bg-purple-50 text-purple-700 border border-purple-300 shadow-sm'
                      : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-purple-700 hover:bg-slate-100'
                  }`}
                >
                  <FileText size={12} className="text-purple-600" /> Notes ({topicStats.withNotes})
                </button>
              )}

              <button
                onClick={() => setInternalDiffFilter('unsolved')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                  internalDiffFilter === 'unsolved'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-sm'
                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-purple-700 hover:bg-slate-100'
                }`}
              >
                <Flame size={12} className="text-purple-600" /> Unsolved ({problems.length - topicStats.groupSolved})
              </button>
            </div>

            <div className="text-xs font-semibold text-slate-500 font-mono">
              Showing <span className="text-slate-900 font-bold">{displayedProblems.length}</span> of {problems.length}
            </div>
          </div>

          {/* Grid of Cards */}
          {displayedProblems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50/50 border border-slate-200 rounded-2xl space-y-1">
              <p className="font-semibold text-slate-600">No problems match the selected filter.</p>
              <p className="text-[11px] text-slate-400">Try changing your difficulty or search query.</p>
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

          {/* Striver Official Topic Contest Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold shrink-0 shadow-lg shadow-amber-500/10">
                <Trophy size={22} />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                  <span>{cat.title} Contest</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-mono">
                    • 3 Problems • 2 hours
                  </span>
                </h4>
                <p className="text-xs text-slate-500 font-medium">Test your problem-solving speed & timed accuracy on {cat.title}</p>
              </div>
            </div>
            <button
              onClick={() => setIsContestOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-200 transition-all hover:scale-105 shrink-0 uppercase tracking-wider"
            >
              Start Contest
            </button>
          </div>
        </div>
      )}

      {/* Topic Contest Modal */}
      <ContestModal
        isOpen={isContestOpen}
        onClose={() => setIsContestOpen(false)}
        topicTitle={cat.title}
        problems={problems}
        solvedStatus={solvedStatus}
        toggleSolved={toggleSolved}
      />
    </div>
  );
};
