import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { allTopics } from '../data/allData';
import { TopicItem, AlgorithmType } from '../types';
import { calculateRetentionScore, formatDisplayDate, getTodayISO } from '../utils/spacedRepetition';
import { DifficultyRatingModal } from './common/DifficultyRatingModal';
import { BookmarkCheck, Clock, Star, CheckCircle2, ChevronRight, Flame, Brain, Calendar, Zap, Box } from 'lucide-react';

interface RevisionPlannerProps {
  onSelectTopic: (topic: TopicItem) => void;
}

export const RevisionPlanner: React.FC<RevisionPlannerProps> = ({ onSelectTopic }) => {
  const { progress, setAlgorithm, getDueRevisionsCount } = useProgress();
  const [ratingTargetTopic, setRatingTargetTopic] = useState<TopicItem | null>(null);
  const [filterTab, setFilterTab] = useState<'due' | 'all' | 'starred'>('due');

  const todayStr = getTodayISO();
  const dueCount = getDueRevisionsCount();

  // Find all topics with revision records or marked needs-revision / starred
  const allRevisionTopics = allTopics.filter(t => {
    const rev = progress.revisions[t.id];
    const isNeedsRev = progress.statuses[t.id] === 'needs-revision';
    const isStarred = progress.starred[t.id];
    const isDue = rev ? rev.nextRevisionDate <= todayStr : isNeedsRev;

    if (filterTab === 'due') return isDue || isNeedsRev;
    if (filterTab === 'starred') return isStarred;
    return rev || isNeedsRev || isStarred;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Compact Top Banner Header */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Info Column */}
        <div className="space-y-1.5 min-w-0 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider flex items-center gap-1">
              <Flame size={13} className="text-amber-400" />
              <span>Spaced Repetition Engine</span>
            </span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md">
              🔥 {dueCount} Questions Due Today
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Memory & Revision Scheduler
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-snug">
            Review questions based on your comprehension level (😎 Easy, 🙂 Medium, 😵 Hard, ❌ Couldn't solve) and adaptive forgetting curve decay algorithms.
          </p>
        </div>

        {/* Compact Horizontal Algorithm Switcher */}
        <div className="bg-slate-950/90 p-1.5 rounded-xl border border-slate-800 shrink-0 self-start lg:self-center">
          <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-1 px-1">
            Active Algorithm
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {(
              [
                { id: 'smart-adaptive', label: 'Smart Adaptive', icon: '🧠' },
                { id: 'sm2', label: 'SuperMemo SM-2', icon: '⚡' },
                { id: 'leitner', label: 'Leitner 5-Box', icon: '📦' },
              ] as const
            ).map(algo => (
              <button
                key={algo.id}
                onClick={() => setAlgorithm(algo.id as AlgorithmType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  progress.activeAlgorithm === algo.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{algo.icon}</span>
                <span>{algo.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterTab('due')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterTab === 'due'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Flame size={14} />
            <span>Due Today ({dueCount})</span>
          </button>

          <button
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterTab === 'all'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Calendar size={14} />
            <span>All Scheduled</span>
          </button>

          <button
            onClick={() => setFilterTab('starred')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterTab === 'starred'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Star size={14} />
            <span>Starred Items</span>
          </button>
        </div>
      </div>

      {/* Topics List */}
      {allRevisionTopics.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your Revision Queue is Up to Date!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Great job! You have no pending revisions for today. Solve topics or practice flashcards to build your revision schedule.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allRevisionTopics.map(topic => {
            const revRecord = progress.revisions[topic.id];
            const lastAttempt = revRecord?.lastAttemptedFormatted || 'Not attempted';
            const nextRev = revRecord?.nextRevisionDateFormatted || '13 Sep';
            const scheduledDates = revRecord?.scheduledDates || ['13 Sep', '16 Sep', '23 Sep', '07 Oct', '07 Nov'];

            const retentionPct = revRecord
              ? calculateRetentionScore(revRecord.lastAttempted, revRecord.nextRevisionDate)
              : 50;

            const isOverdue = revRecord ? revRecord.nextRevisionDate <= todayStr : true;

            return (
              <div
                key={topic.id}
                className={`glass-panel glass-panel-hover p-5 sm:p-6 rounded-2xl border transition-all space-y-4 relative ${
                  isOverdue ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-800'
                }`}
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300">
                        {topic.category}
                      </span>
                      {progress.starred[topic.id] && (
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                      )}
                      {isOverdue && (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Due Now 🔥
                        </span>
                      )}
                    </div>
                    <h3
                      onClick={() => onSelectTopic(topic)}
                      className="font-extrabold text-white text-base sm:text-lg hover:text-purple-300 transition-colors cursor-pointer leading-snug"
                    >
                      {topic.title}
                    </h3>
                  </div>

                  {/* Retention Score Pill */}
                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-400 font-semibold block mb-0.5">Retention</span>
                    <span
                      className={`text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg border ${
                        retentionPct > 70
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : retentionPct > 40
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {retentionPct}%
                    </span>
                  </div>
                </div>

                {/* Dates Information Display */}
                <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-slate-300 font-medium">
                    <span>
                      Last attempted: <strong className="text-white font-bold">{lastAttempt}</strong>
                    </span>
                    <span>
                      Next due: <strong className="text-purple-300 font-bold">{nextRev}</strong>
                    </span>
                  </div>

                  {/* Next Revision Dates Sequence */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-900">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                      Calculated Revision Schedule:
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold text-slate-200 pt-0.5">
                      {scheduledDates.map((dStr, idx) => (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-md border text-xs whitespace-nowrap ${
                            idx === 0
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold'
                              : 'bg-slate-900 text-slate-300 border-slate-800'
                          }`}
                        >
                          {dStr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onSelectTopic(topic)}
                    className="text-xs sm:text-sm font-bold text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Read Topic Notes</span>
                    <ChevronRight size={15} />
                  </button>

                  <button
                    onClick={() => setRatingTargetTopic(topic)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-purple-600/20 flex items-center gap-1.5"
                  >
                    <Flame size={15} />
                    <span>Rate Comprehension</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Comprehension Rating Modal */}
      {ratingTargetTopic && (
        <DifficultyRatingModal
          topic={ratingTargetTopic}
          isOpen={!!ratingTargetTopic}
          onClose={() => setRatingTargetTopic(null)}
        />
      )}
    </div>
  );
};
