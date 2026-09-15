import React from 'react';
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { StriverProblem } from './types';

interface ProblemCardProps {
  prob: StriverProblem;
  isDone: boolean;
  toggleSolved: (id: string) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ prob, isDone, toggleSolved }) => {
  const getDifficultyAccent = () => {
    if (prob.difficulty === 'Easy') return 'border-l-emerald-500 shadow-emerald-500/5';
    if (prob.difficulty === 'Medium') return 'border-l-amber-500 shadow-amber-500/5';
    if (prob.difficulty === 'Hard') return 'border-l-rose-500 shadow-rose-500/5';
    return 'border-l-slate-600';
  };

  return (
    <div
      className={`group p-4 rounded-2xl border border-l-4 transition-all duration-200 flex items-center justify-between gap-3.5 ${getDifficultyAccent()} ${
        isDone
          ? 'bg-[#0D1826]/60 border-slate-800/60 text-slate-300 opacity-80'
          : 'bg-[#0D1322] border-slate-800/80 hover:border-slate-700 hover:bg-[#11192E] text-slate-100 shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Solved Checkbox Toggle Button */}
        <button
          onClick={() => toggleSolved(prob.id)}
          className="shrink-0 transition-transform active:scale-90 p-1 hover:bg-slate-800/60 rounded-xl"
          title={isDone ? 'Mark as unsolved' : 'Mark as solved'}
        >
          {isDone ? (
            <CheckCircle2 size={22} className="text-emerald-400 fill-emerald-500/20 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
          ) : (
            <Circle size={22} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
          )}
        </button>

        <div className="min-w-0 space-y-2 flex-1">
          {/* Problem Title Link */}
          <a
            href={prob.url || '#'}
            target="_blank"
            rel="noreferrer"
            className={`text-xs sm:text-sm font-semibold tracking-tight inline-flex items-center gap-1.5 transition-colors max-w-full ${
              isDone
                ? 'line-through text-slate-400 font-normal'
                : 'text-slate-100 group-hover:text-cyan-300 hover:underline'
            }`}
          >
            <span className="truncate">{prob.title}</span>
            {prob.url && (
              <ExternalLink
                size={13}
                className="shrink-0 text-slate-500 group-hover:text-cyan-400 opacity-80 group-hover:opacity-100 transition-all"
              />
            )}
          </a>

          {/* Badges Strip */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Dynamic Source Badges */}
            {prob.source && prob.source.includes('&') ? (
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm">
                👑 Multi-Source
              </span>
            ) : prob.source === 'Fraz' ? (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30">
                🎯 Fraz
              </span>
            ) : prob.source === 'NeetCode 150' ? (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                🚀 NeetCode 150
              </span>
            ) : prob.source === 'Love Babbar' ? (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30">
                🔥 Love Babbar
              </span>
            ) : (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                ⚡ Striver
              </span>
            )}

            {/* Difficulty Badge */}
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                prob.difficulty === 'Easy'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : prob.difficulty === 'Medium'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              {prob.difficulty}
            </span>

            {/* Topic Tags */}
            {prob.tags &&
              prob.tags.slice(0, 2).map((t, idx) => (
                <span
                  key={idx}
                  className="text-[9px] text-slate-400 bg-slate-950/80 border border-slate-800 px-2 py-0.5 rounded-md font-mono"
                >
                  {t}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

