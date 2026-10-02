import React, { useState } from 'react';
import { CheckCircle2, Circle, ExternalLink, Star, FileText, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import { StriverProblem } from './types';
import { useProgress } from '../../context/ProgressContext';
import { QuestionNotesModal } from './QuestionNotesModal';

interface ProblemCardProps {
  prob: StriverProblem;
  isDone: boolean;
  toggleSolved: (id: string) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ prob, isDone, toggleSolved }) => {
  const { progress, toggleStar } = useProgress();
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [showInlineNote, setShowInlineNote] = useState(false);

  const isStarred = !!progress.starred[prob.id];
  const noteText = progress.notes[prob.id] || '';
  const hasNote = Boolean(noteText.trim());

  const getDifficultyAccent = () => {
    if (prob.difficulty === 'Easy') return 'border-l-emerald-500 shadow-emerald-500/5';
    if (prob.difficulty === 'Medium') return 'border-l-amber-500 shadow-amber-500/5';
    if (prob.difficulty === 'Hard') return 'border-l-rose-500 shadow-rose-500/5';
    return 'border-l-slate-600';
  };

  return (
    <>
      <div
        className={`group p-4 rounded-2xl border border-l-4 transition-all duration-200 flex flex-col gap-2.5 ${getDifficultyAccent()} ${
          isDone
            ? 'bg-slate-50/80 border-slate-200 text-slate-500 opacity-85'
            : isStarred
            ? 'bg-amber-50/20 border-amber-200/80 hover:border-amber-300 text-slate-800 shadow-md hover:shadow-amber-500/5 hover:-translate-y-0.5'
            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-800 shadow-sm hover:shadow-cyan-500/5 hover:-translate-y-0.5'
        }`}
      >
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Solved Checkbox Toggle Button */}
            <button
              onClick={() => toggleSolved(prob.id)}
              className="shrink-0 mt-0.5 transition-transform active:scale-90 p-1 hover:bg-slate-100 rounded-xl"
              title={isDone ? 'Mark as unsolved' : 'Mark as solved'}
              aria-label={isDone ? 'Mark as unsolved' : 'Mark as solved'}
            >
              {isDone ? (
                <CheckCircle2 size={22} className="text-emerald-600 fill-emerald-500/20 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
              ) : (
                <Circle size={22} className="text-slate-400 group-hover:text-cyan-600 transition-colors" />
              )}
            </button>

            <div className="min-w-0 space-y-1.5 flex-1">
              {/* Problem Title Link */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <a
                  href={prob.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-xs sm:text-sm font-semibold tracking-tight inline-flex items-center gap-1.5 transition-colors max-w-full ${
                    isDone
                      ? 'line-through text-slate-400 font-normal'
                      : 'text-slate-800 group-hover:text-cyan-700 hover:underline'
                  }`}
                >
                  <span className="truncate">{prob.title}</span>
                  {prob.url && (
                    <ExternalLink
                      size={13}
                      className="shrink-0 text-slate-400 group-hover:text-cyan-600 opacity-80 group-hover:opacity-100 transition-all"
                    />
                  )}
                </a>
              </div>

              {/* Badges Strip */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Dynamic Source Badges */}
                {prob.source && prob.source.includes('&') ? (
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-gradient-to-r from-purple-500/15 via-cyan-500/15 to-emerald-500/15 text-cyan-800 border border-cyan-500/30 shadow-sm">
                    👑 Multi-Source
                  </span>
                ) : prob.source === 'Fraz' ? (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                    🎯 Fraz
                  </span>
                ) : prob.source === 'NeetCode 150' ? (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    🚀 NeetCode 150
                  </span>
                ) : prob.source === 'Love Babbar' ? (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    🔥 Love Babbar
                  </span>
                ) : (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200">
                    ⚡ Striver
                  </span>
                )}

                {/* Striver Level Badge: Basic | Core | Pro */}
                {prob.striver_level && (
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-md border shadow-sm ${
                      prob.striver_level === 'Basic'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : prob.striver_level === 'Core'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                        : 'bg-rose-50 text-rose-700 border-rose-300'
                    }`}
                  >
                    {prob.striver_level === 'Basic' && '🌱 Basic'}
                    {prob.striver_level === 'Core' && '⚡ Core'}
                    {prob.striver_level === 'Pro' && '🔥 Pro'}
                  </span>
                )}

                {/* Difficulty Badge */}
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                    prob.difficulty === 'Easy'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : prob.difficulty === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {prob.difficulty}
                </span>

                {/* Topic Tags */}
                {prob.tags &&
                  prob.tags.slice(0, 2).map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] text-slate-500 bg-slate-100/90 border border-slate-200 px-2 py-0.5 rounded-md font-mono"
                    >
                      {t}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Action Icons (Star Mark & Notes Button) */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Notes Button */}
            <button
              onClick={() => setIsNotesModalOpen(true)}
              className={`p-1.5 rounded-xl border transition-all flex items-center gap-1 text-xs font-semibold ${
                hasNote
                  ? 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100 shadow-sm'
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50/50'
              }`}
              title={hasNote ? 'View/Edit your revision note' : 'Write revision note'}
              aria-label={hasNote ? 'View/Edit revision note' : 'Write revision note'}
            >
              <FileText size={15} className={hasNote ? 'text-purple-600 fill-purple-100' : 'text-slate-400'} />
              {hasNote && <span className="text-[10px] font-bold hidden sm:inline">Note</span>}
            </button>

            {/* Star Mark Button */}
            <button
              onClick={() => toggleStar(prob.id)}
              className={`p-1.5 rounded-xl border transition-all active:scale-90 flex items-center justify-center ${
                isStarred
                  ? 'bg-amber-50 text-amber-500 border-amber-300 shadow-sm hover:bg-amber-100'
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50/50'
              }`}
              title={isStarred ? 'Starred for revision (click to unstar)' : 'Star mark for revision'}
              aria-label={isStarred ? 'Unstar question' : 'Star question'}
            >
              <Star
                size={16}
                className={isStarred ? 'fill-amber-400 text-amber-500' : 'text-slate-400 hover:text-amber-400'}
              />
            </button>
          </div>
        </div>

        {/* Inline Note Preview Banner if note exists */}
        {hasNote && (
          <div className="mt-1 pt-2 border-t border-slate-100">
            <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-200/70 text-xs text-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-purple-700 flex items-center gap-1">
                  <FileText size={11} /> Personal Revision Note
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsNotesModalOpen(true)}
                    className="text-[10px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-0.5 hover:underline"
                  >
                    <Edit3 size={11} /> Edit
                  </button>
                  <button
                    onClick={() => setShowInlineNote(!showInlineNote)}
                    className="text-slate-400 hover:text-slate-600 p-0.5"
                    title={showInlineNote ? 'Collapse note' : 'Expand note'}
                  >
                    {showInlineNote ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>
              </div>

              <p className={`font-mono text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap ${showInlineNote ? '' : 'line-clamp-2'}`}>
                {noteText}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dedicated Question Notes Modal */}
      <QuestionNotesModal
        problem={prob}
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
      />
    </>
  );
};
